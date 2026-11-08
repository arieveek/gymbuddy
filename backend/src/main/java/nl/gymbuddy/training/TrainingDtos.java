package nl.gymbuddy.training;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public final class TrainingDtos {

	private TrainingDtos() {
	}

	public record SessionDto(
			@NotNull UUID id,
			@NotNull LocalDate date,
			@Min(1) @Max(5) int level,
			@Min(1) @Max(100) int step,
			boolean lightWeek,
			@Min(0) @Max(10_000) int repsTotal,
			@Min(0) @Max(100_000) int holdSecondsTotal,
			Instant createdAt) {

		static SessionDto of(WorkoutSession s) {
			return new SessionDto(s.getId(), s.getDate(), s.getLevel(), s.getStep(), s.isLightWeek(), s.getRepsTotal(),
					s.getHoldSecondsTotal(), s.getCreatedAt());
		}

	}

	public record TestDto(
			@NotNull UUID id,
			@NotNull LocalDate date,
			@Min(0) @Max(500) int pullups,
			@Min(0) @Max(3_600) int hangSeconds,
			Instant createdAt) {

		static TestDto of(TestResult t) {
			return new TestDto(t.getId(), t.getDate(), t.getPullups(), t.getHangSeconds(), t.getCreatedAt());
		}

	}

}
