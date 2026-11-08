package nl.gymbuddy.training;

import java.util.List;
import java.util.UUID;

import jakarta.validation.Valid;
import nl.gymbuddy.common.CurrentUser;
import nl.gymbuddy.training.TrainingDtos.SessionDto;
import nl.gymbuddy.training.TrainingDtos.TestDto;
import nl.gymbuddy.training.TrainingService.Saved;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/athletes/{athleteId}")
public class TrainingController {

	private final TrainingService service;

	public TrainingController(TrainingService service) {
		this.service = service;
	}

	@GetMapping("/sessions")
	public List<SessionDto> sessions(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID athleteId) {
		return service.sessions(athleteId, CurrentUser.id(jwt));
	}

	@PostMapping("/sessions")
	public ResponseEntity<SessionDto> addSession(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID athleteId,
			@Valid @RequestBody SessionDto body) {
		return respond(service.addSession(athleteId, CurrentUser.id(jwt), body));
	}

	@GetMapping("/tests")
	public List<TestDto> tests(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID athleteId) {
		return service.tests(athleteId, CurrentUser.id(jwt));
	}

	@PostMapping("/tests")
	public ResponseEntity<TestDto> addTest(@AuthenticationPrincipal Jwt jwt, @PathVariable UUID athleteId,
			@Valid @RequestBody TestDto body) {
		return respond(service.addTest(athleteId, CurrentUser.id(jwt), body));
	}

	private static <T> ResponseEntity<T> respond(Saved<T> saved) {
		return ResponseEntity.status(saved.created() ? HttpStatus.CREATED : HttpStatus.OK).body(saved.value());
	}

}
