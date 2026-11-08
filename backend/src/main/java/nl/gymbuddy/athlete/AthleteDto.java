package nl.gymbuddy.athlete;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/**
 * Profile as sent and received. The id is made on the device; updatedAt decides which version wins.
 * injuries: body areas the app keeps exercises away from; missing means none (older app versions).
 */
public record AthleteDto(
		@NotNull UUID id,
		@NotBlank @Size(max = 30) String name,
		@NotNull @Pattern(regexp = "child|adult") String ageGroup,
		@Min(1) @Max(5) int level,
		@NotNull @Pattern(regexp = "nl|en") String language,
		@Size(max = 8) List<@NotNull @Pattern(regexp = "hands|wrist|elbow|shoulder|back|hip|knee|ankle") String> injuries,
		@NotNull Instant updatedAt) {

	public List<String> injuriesOrEmpty() {
		return injuries == null ? List.of() : injuries.stream().distinct().toList();
	}

	static AthleteDto of(Athlete a) {
		return new AthleteDto(a.getId(), a.getName(), a.getAgeGroup(), a.getLevel(), a.getLanguage(), a.getInjuries(), a.getUpdatedAt());
	}

}
