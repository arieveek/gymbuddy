package nl.gymbuddy.training;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** One test result. The frontend derives the level from it. */
@Entity
@Table(name = "tests")
public class TestResult {

	@Id
	private UUID id;

	@Column(name = "athlete_id", nullable = false)
	private UUID athleteId;

	@Column(nullable = false)
	private LocalDate date;

	@Column(nullable = false)
	private int pullups;

	@Column(name = "hang_seconds", nullable = false)
	private int hangSeconds;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	protected TestResult() {
	}

	public TestResult(UUID id, UUID athleteId, LocalDate date, int pullups, int hangSeconds, Instant createdAt) {
		this.id = id;
		this.athleteId = athleteId;
		this.date = date;
		this.pullups = pullups;
		this.hangSeconds = hangSeconds;
		this.createdAt = createdAt;
	}

	public UUID getId() { return id; }
	public UUID getAthleteId() { return athleteId; }
	public LocalDate getDate() { return date; }
	public int getPullups() { return pullups; }
	public int getHangSeconds() { return hangSeconds; }
	public Instant getCreatedAt() { return createdAt; }

}
