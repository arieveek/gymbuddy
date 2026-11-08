package nl.gymbuddy.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.Instant;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.UUID;

import nl.gymbuddy.auth.AuthDtos.TokenResponse;
import nl.gymbuddy.common.ApiException;
import nl.gymbuddy.config.GymbuddyProperties;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwsHeader;
import org.springframework.security.oauth2.jwt.JwtClaimsSet;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.JwtEncoderParameters;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Register, login, refresh and logout. Access tokens are short-lived JWTs; refresh tokens are random,
 * stored hashed, and rotated on every use. Presenting an already-used refresh token means it was copied,
 * so every token of that account is revoked.
 */
@Service
public class AuthService {

	private static final SecureRandom RANDOM = new SecureRandom();

	private final UserRepository users;
	private final RefreshTokenRepository tokens;
	private final PasswordEncoder passwordEncoder;
	private final JwtEncoder jwtEncoder;
	private final GymbuddyProperties props;
	/** Compared against when the email is unknown, so a login takes as long either way. */
	private final String dummyHash;

	public AuthService(UserRepository users, RefreshTokenRepository tokens, PasswordEncoder passwordEncoder,
			JwtEncoder jwtEncoder, GymbuddyProperties props) {
		this.users = users;
		this.tokens = tokens;
		this.passwordEncoder = passwordEncoder;
		this.jwtEncoder = jwtEncoder;
		this.props = props;
		this.dummyHash = passwordEncoder.encode("not-a-real-password");
	}

	/** Creates a pending account. It gets no tokens until the admin approves it. */
	@Transactional
	public void register(String email, String password) {
		String normalized = normalize(email);
		if (users.existsByEmail(normalized)) {
			throw new ApiException(HttpStatus.CONFLICT, "EMAIL_TAKEN");
		}
		try {
			users.saveAndFlush(new User(normalized, passwordEncoder.encode(password)));
		}
		catch (DataIntegrityViolationException e) {
			throw new ApiException(HttpStatus.CONFLICT, "EMAIL_TAKEN");
		}
	}

	@Transactional
	public TokenResponse login(String email, String password, boolean rememberMe) {
		User user = users.findByEmail(normalize(email)).orElse(null);
		boolean ok = passwordEncoder.matches(password, user != null ? user.getPasswordHash() : dummyHash);
		if (user == null || !ok) {
			throw new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_CREDENTIALS");
		}
		requireApproved(user);
		return issue(user.getId(), rememberMe);
	}

	@Transactional(noRollbackFor = ApiException.class)
	public TokenResponse refresh(String refreshToken) {
		Instant now = Instant.now();
		RefreshToken stored = tokens.findByTokenHash(hash(refreshToken))
				.orElseThrow(AuthService::invalidRefresh);
		if (stored.isRevoked()) {
			tokens.revokeAllForUser(stored.getUserId(), now);
			throw invalidRefresh();
		}
		if (stored.isExpired(now)) {
			throw invalidRefresh();
		}
		User user = users.findById(stored.getUserId()).orElseThrow(AuthService::invalidRefresh);
		if (!user.isApproved()) {
			tokens.revokeAllForUser(user.getId(), now);
		}
		requireApproved(user);
		stored.revoke(now);
		// The new token gets a full lifetime from now: the login slides with every app open.
		return issue(stored.getUserId(), stored.isRemember());
	}

	/** Removes expired refresh tokens; every app open rotates one, so they would pile up. Runs nightly. */
	@Scheduled(cron = "0 30 4 * * *")
	@Transactional
	public int purgeExpiredTokens() {
		return tokens.deleteExpired(Instant.now());
	}

	/** Pending and blocked accounts get a code the app can explain, only after the password was right. */
	private static void requireApproved(User user) {
		switch (user.getStatus()) {
			case approved -> { }
			case pending -> throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_PENDING");
			case blocked -> throw new ApiException(HttpStatus.FORBIDDEN, "ACCOUNT_BLOCKED");
		}
	}

	@Transactional
	public void logout(String refreshToken) {
		tokens.findByTokenHash(hash(refreshToken)).ifPresent(t -> t.revoke(Instant.now()));
	}

	private TokenResponse issue(UUID userId, boolean remember) {
		Instant now = Instant.now();
		Duration refreshTtl = remember ? props.rememberMeTtl() : props.sessionTtl();
		JwtClaimsSet claims = JwtClaimsSet.builder()
				.issuer("gymbuddy")
				.subject(userId.toString())
				.issuedAt(now)
				.expiresAt(now.plus(props.accessTokenTtl()))
				.build();
		String access = jwtEncoder.encode(JwtEncoderParameters.from(JwsHeader.with(MacAlgorithm.HS256).build(), claims))
				.getTokenValue();

		byte[] raw = new byte[32];
		RANDOM.nextBytes(raw);
		String refresh = Base64.getUrlEncoder().withoutPadding().encodeToString(raw);
		tokens.save(new RefreshToken(userId, hash(refresh), now.plus(refreshTtl), remember));
		return new TokenResponse(access, refresh, props.accessTokenTtl().toSeconds(), refreshTtl.toSeconds(), remember);
	}

	private static ApiException invalidRefresh() {
		return new ApiException(HttpStatus.UNAUTHORIZED, "INVALID_REFRESH_TOKEN");
	}

	static String normalize(String email) {
		return email.trim().toLowerCase(Locale.ROOT);
	}

	static String hash(String token) {
		try {
			byte[] digest = MessageDigest.getInstance("SHA-256").digest(token.getBytes(StandardCharsets.UTF_8));
			return HexFormat.of().formatHex(digest);
		}
		catch (NoSuchAlgorithmException e) {
			throw new IllegalStateException(e);
		}
	}

}
