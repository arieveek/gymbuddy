package nl.gymbuddy.auth;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.core.convert.converter.Converter;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;

/**
 * Turns a valid access token into roles by looking the account up on every request, so blocking or deleting
 * an account takes effect immediately instead of when its 15-minute token expires.
 * Approved accounts get ROLE_USER (and ROLE_ADMIN for the admin); pending, blocked or deleted ones get nothing.
 */
@Component
public class AccountAuthenticationConverter implements Converter<Jwt, AbstractAuthenticationToken> {

	private final UserRepository users;

	public AccountAuthenticationConverter(UserRepository users) {
		this.users = users;
	}

	@Override
	public AbstractAuthenticationToken convert(Jwt jwt) {
		List<GrantedAuthority> authorities = new ArrayList<>();
		try {
			users.findById(UUID.fromString(jwt.getSubject())).filter(User::isApproved).ifPresent(u -> {
				authorities.add(new SimpleGrantedAuthority("ROLE_USER"));
				if (u.isAdmin()) {
					authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
				}
			});
		}
		catch (IllegalArgumentException e) {
			// Subject is not a UUID: no roles.
		}
		return new JwtAuthenticationToken(jwt, authorities, jwt.getSubject());
	}

}
