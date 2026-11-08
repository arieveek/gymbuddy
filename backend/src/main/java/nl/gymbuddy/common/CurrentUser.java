package nl.gymbuddy.common;

import java.util.UUID;

import org.springframework.security.oauth2.jwt.Jwt;

/** The signed-in user's id is the access token's subject. */
public final class CurrentUser {

	private CurrentUser() {
	}

	public static UUID id(Jwt jwt) {
		return UUID.fromString(jwt.getSubject());
	}

}
