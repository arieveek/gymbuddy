package nl.gymbuddy.athlete;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** The athlete profile: first name, age group, level and language. Nothing more personal is stored. */
@Entity
@Table(name = "athletes")
public class Athlete {

	@Id
	private UUID id;

	@Column(name = "user_id", nullable = false)
	private UUID userId;

	@Column(nullable = false)
	private String name;

	@Column(name = "age_group", nullable = false)
	private String ageGroup;

	@Column(nullable = false)
	private int level;

	@Column(nullable = false)
	private String language;

	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected Athlete() {
	}

	public Athlete(UUID id, UUID userId) {
		this.id = id;
		this.userId = userId;
	}

	public void apply(String name, String ageGroup, int level, String language, Instant updatedAt) {
		this.name = name;
		this.ageGroup = ageGroup;
		this.level = level;
		this.language = language;
		this.updatedAt = updatedAt;
	}

	public UUID getId() {
		return id;
	}

	public UUID getUserId() {
		return userId;
	}

	public String getName() {
		return name;
	}

	public String getAgeGroup() {
		return ageGroup;
	}

	public int getLevel() {
		return level;
	}

	public String getLanguage() {
		return language;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}

}
