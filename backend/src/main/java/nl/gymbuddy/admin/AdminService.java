package nl.gymbuddy.admin;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import nl.gymbuddy.athlete.AthleteRepository;
import nl.gymbuddy.auth.RefreshTokenRepository;
import nl.gymbuddy.auth.User;
import nl.gymbuddy.auth.UserRepository;
import nl.gymbuddy.auth.UserRole;
import nl.gymbuddy.auth.UserStatus;
import nl.gymbuddy.common.ApiException;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/** Approving, blocking and deleting accounts. The admin cannot lock themselves out. */
@Service
public class AdminService {

	public record AccountDto(UUID id, String email, UserRole role, UserStatus status, Instant createdAt, Instant approvedAt, long athletes) {
	}

	private final UserRepository users;
	private final RefreshTokenRepository tokens;
	private final AthleteRepository athletes;

	public AdminService(UserRepository users, RefreshTokenRepository tokens, AthleteRepository athletes) {
		this.users = users;
		this.tokens = tokens;
		this.athletes = athletes;
	}

	/** Pending accounts first (they need a decision), then newest first. */
	@Transactional(readOnly = true)
	public List<AccountDto> list() {
		return users.findAll().stream()
				.sorted(Comparator.comparing((User u) -> u.getStatus() != UserStatus.pending).thenComparing(User::getCreatedAt, Comparator.reverseOrder()))
				.map(this::dto)
				.toList();
	}

	@Transactional
	public AccountDto approve(UUID id, UUID adminId) {
		User u = other(id, adminId);
		u.approve();
		return dto(u);
	}

	/** Blocks the account and revokes its refresh tokens; its access token stops working on the next request. */
	@Transactional
	public AccountDto block(UUID id, UUID adminId) {
		User u = other(id, adminId);
		u.block();
		tokens.revokeAllForUser(u.getId(), Instant.now());
		return dto(u);
	}

	/** Deletes the account with its athletes, workouts, tests and tokens (cascades in the database). */
	@Transactional
	public void delete(UUID id, UUID adminId) {
		users.delete(other(id, adminId));
	}

	private User other(UUID id, UUID adminId) {
		if (id.equals(adminId)) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "CANNOT_CHANGE_SELF");
		}
		return users.findById(id).orElseThrow(ApiException::notFound);
	}

	private AccountDto dto(User u) {
		return new AccountDto(u.getId(), u.getEmail(), u.getRole(), u.getStatus(), u.getCreatedAt(), u.getApprovedAt(),
				athletes.countByUserId(u.getId()));
	}

}
