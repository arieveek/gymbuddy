package nl.gymbuddy.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

	private AuthDtos() {
	}

	public record RegisterRequest(@NotBlank @Email @Size(max = 254) String email, @NotBlank @Size(min = 8, max = 200) String password) {
	}

	/**
	 * rememberMe: stay logged in for weeks (sliding with every app open) instead of one browser session.
	 * A Boolean, not boolean: Jackson 3 refuses a missing primitive, and leaving it out must mean "no".
	 */
	public record LoginRequest(@NotBlank String email, @NotBlank String password, Boolean rememberMe) {

		public boolean remember() {
			return Boolean.TRUE.equals(rememberMe);
		}

	}

	public record RefreshRequest(@NotBlank @Size(max = 200) String refreshToken) {
	}

	/**
	 * expiresIn: seconds until the access token expires. refreshExpiresIn: seconds until the login ends unless the
	 * app is used again (every refresh starts this window over). remember: whether this is a "keep me logged in" login.
	 */
	public record TokenResponse(String accessToken, String refreshToken, long expiresIn, long refreshExpiresIn, boolean remember) {
	}

}
