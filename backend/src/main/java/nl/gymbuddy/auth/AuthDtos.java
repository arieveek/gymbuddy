package nl.gymbuddy.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {

	private AuthDtos() {
	}

	public record RegisterRequest(@NotBlank @Email @Size(max = 254) String email, @NotBlank @Size(min = 8, max = 200) String password) {
	}

	public record LoginRequest(@NotBlank String email, @NotBlank String password) {
	}

	public record RefreshRequest(@NotBlank @Size(max = 200) String refreshToken) {
	}

	/** expiresIn: seconds until the access token expires. */
	public record TokenResponse(String accessToken, String refreshToken, long expiresIn) {
	}

}
