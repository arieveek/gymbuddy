package nl.gymbuddy.athlete;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import nl.gymbuddy.common.ApiException;
import nl.gymbuddy.common.CurrentUser;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/athletes")
public class AthleteController {

	private final AthleteService service;

	public AthleteController(AthleteService service) {
		this.service = service;
	}

	@GetMapping
	public List<AthleteDto> list(@AuthenticationPrincipal Jwt jwt) {
		return service.list(CurrentUser.id(jwt));
	}

	@PostMapping
	public AthleteDto create(@AuthenticationPrincipal Jwt jwt, @Valid @RequestBody AthleteDto body) {
		return service.upsert(body, CurrentUser.id(jwt));
	}

	@PutMapping("/{id}")
	public AthleteDto update(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID id, @Valid @RequestBody AthleteDto body) {
		if (!id.equals(body.id())) {
			throw new ApiException(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED");
		}
		return service.upsert(body, CurrentUser.id(jwt));
	}

}
