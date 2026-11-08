package nl.gymbuddy.auth;

import java.util.UUID;

import nl.gymbuddy.common.ApiException;
import nl.gymbuddy.common.CurrentUser;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/** Who is signed in, so the app knows whether to show the admin page. */
@RestController
public class MeController {

	public record Me(UUID id, String email, UserRole role, UserStatus status) {
	}

	private final UserRepository users;

	public MeController(UserRepository users) {
		this.users = users;
	}

	@GetMapping("/api/me")
	public Me me(@AuthenticationPrincipal Jwt jwt) {
		User u = users.findById(CurrentUser.id(jwt)).orElseThrow(ApiException::notFound);
		return new Me(u.getId(), u.getEmail(), u.getRole(), u.getStatus());
	}

}
