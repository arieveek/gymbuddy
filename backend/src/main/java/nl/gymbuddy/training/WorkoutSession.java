package nl.gymbuddy.training;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** One completed workout. The id is made on the device so an offline workout synced twice is stored once. */
@Entity
@Table(name = "sessions")
public class WorkoutSession {

	@Id
	private UUID id;

	@Column(name = "athlete_id", nullable = false)
	private UUID athleteId;

	@Column(nullable = false)
	private LocalDate date;

	@Column(nullable = false)
	private int level;

	@Column(nullable = false)
	private int step;

	@Column(name = "light_week", nullable = false)
	private boolean lightWeek;

	@Column(name = "reps_total", nullable = false)
	private int repsTotal;

	@Column(name = "hold_seconds_total", nullable = false)
	private int holdSecondsTotal;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected WorkoutSession() {
	}

	public WorkoutSession(UUID id, UUID athleteId, LocalDate date, int level, int step, boolean lightWeek, int repsTotal,
			int holdSecondsTotal, Instant createdAt) {
		this.id = id;
		this.athleteId = athleteId;
		this.date = date;
		this.level = level;
		this.step = step;
		this.lightWeek = lightWeek;
		this.repsTotal = repsTotal;
		this.holdSecondsTotal = holdSecondsTotal;
		this.createdAt = createdAt;
	}

	public UUID getId() { return id; }
	public UUID getAthleteId() { return athleteId; }
	public LocalDate getDate() { return date; }
	public int getLevel() { return level; }
	public int getStep() { return step; }
	public boolean isLightWeek() { return lightWeek; }
	public int getRepsTotal() { return repsTotal; }
	public int getHoldSecondsTotal() { return holdSecondsTotal; }
	public Instant getCreatedAt() { return createdAt; }

}
