package nl.gymbuddy.auth;

import jakarta.validation.Valid;
import nl.gymbuddy.auth.AuthDtos.LoginRequest;
import nl.gymbuddy.auth.AuthDtos.RefreshRequest;
import nl.gymbuddy.auth.AuthDtos.RegisterRequest;
import nl.gymbuddy.auth.AuthDtos.TokenResponse;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

	private final AuthService auth;

	public AuthController(AuthService auth) {
		this.auth = auth;
	}

	@PostMapping("/register")
	@ResponseStatus(HttpStatus.CREATED)
	public TokenResponse register(@Valid @RequestBody RegisterRequest body) {
		return auth.register(body.email(), body.password());
	}

	@PostMapping("/login")
	public TokenResponse login(@Valid @RequestBody LoginRequest body) {
		return auth.login(body.email(), body.password());
	}

	@PostMapping("/refresh")
	public TokenResponse refresh(@Valid @RequestBody RefreshRequest body) {
		return auth.refresh(body.refreshToken());
	}

	@PostMapping("/logout")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void logout(@Valid @RequestBody RefreshRequest body) {
		auth.logout(body.refreshToken());
	}

}
