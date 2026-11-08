package nl.gymbuddy.training;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import nl.gymbuddy.athlete.AthleteService;
import nl.gymbuddy.common.ApiException;
import nl.gymbuddy.training.TrainingDtos.SessionDto;
import nl.gymbuddy.training.TrainingDtos.TestDto;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Workouts and tests. Every call first checks that the athlete belongs to the signed-in user.
 * Posts are idempotent on the client-made id: a repeat returns what is stored instead of adding a copy.
 */
@Service
public class TrainingService {

	private final AthleteService athletes;
	private final WorkoutSessionRepository sessions;
	private final TestResultRepository tests;

	public TrainingService(AthleteService athletes, WorkoutSessionRepository sessions, TestResultRepository tests) {
		this.athletes = athletes;
		this.sessions = sessions;
		this.tests = tests;
	}

	@Transactional(readOnly = true)
	public List<SessionDto> sessions(UUID athleteId, UUID userId) {
		athletes.owned(athleteId, userId);
		return sessions.findAllByAthleteIdOrderByDateAscCreatedAtAsc(athleteId).stream().map(SessionDto::of).toList();
	}

	@Transactional
	public Saved<SessionDto> addSession(UUID athleteId, UUID userId, SessionDto in) {
		athletes.owned(athleteId, userId);
		WorkoutSession existing = sessions.findById(in.id()).orElse(null);
		if (existing != null) {
			if (!existing.getAthleteId().equals(athleteId)) {
				throw ApiException.notFound();
			}
			return new Saved<>(SessionDto.of(existing), false);
		}
		WorkoutSession s = new WorkoutSession(in.id(), athleteId, in.date(), in.level(), in.step(), in.lightWeek(),
				in.repsTotal(), in.holdSecondsTotal(), in.createdAt() != null ? in.createdAt() : Instant.now());
		return new Saved<>(SessionDto.of(sessions.save(s)), true);
	}

	@Transactional(readOnly = true)
	public List<TestDto> tests(UUID athleteId, UUID userId) {
		athletes.owned(athleteId, userId);
		return tests.findAllByAthleteIdOrderByDateAscCreatedAtAsc(athleteId).stream().map(TestDto::of).toList();
	}

	@Transactional
	public Saved<TestDto> addTest(UUID athleteId, UUID userId, TestDto in) {
		athletes.owned(athleteId, userId);
		TestResult existing = tests.findById(in.id()).orElse(null);
		if (existing != null) {
			if (!existing.getAthleteId().equals(athleteId)) {
				throw ApiException.notFound();
			}
			return new Saved<>(TestDto.of(existing), false);
		}
		TestResult t = new TestResult(in.id(), athleteId, in.date(), in.pullups(), in.hangSeconds(),
				in.createdAt() != null ? in.createdAt() : Instant.now());
		return new Saved<>(TestDto.of(tests.save(t)), true);
	}

	/** The stored record and whether this call created it (201) or found it already there (200). */
	public record Saved<T>(T value, boolean created) {
	}

}
