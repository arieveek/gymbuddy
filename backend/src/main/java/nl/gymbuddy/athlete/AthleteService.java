package nl.gymbuddy.athlete;

import java.util.List;
import java.util.UUID;

import nl.gymbuddy.common.ApiException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AthleteService {

	private final AthleteRepository athletes;

	public AthleteService(AthleteRepository athletes) {
		this.athletes = athletes;
	}

	/** The athlete if it belongs to this user; otherwise 404, so other families' ids are never confirmed. */
	@Transactional(readOnly = true)
	public Athlete owned(UUID athleteId, UUID userId) {
		return athletes.findByIdAndUserId(athleteId, userId).orElseThrow(ApiException::notFound);
	}

	@Transactional(readOnly = true)
	public List<AthleteDto> list(UUID userId) {
		return athletes.findAllByUserIdOrderByName(userId).stream().map(AthleteDto::of).toList();
	}

	/**
	 * Create or update. Safe to repeat: a device syncing the same profile twice changes nothing, and an older
	 * copy never overwrites a newer one (last write wins on updatedAt). An id owned by another user is a 404.
	 */
	@Transactional
	public AthleteDto upsert(AthleteDto in, UUID userId) {
		Athlete athlete = athletes.findById(in.id()).orElse(null);
		if (athlete == null) {
			athlete = new Athlete(in.id(), userId);
		}
		else if (!athlete.getUserId().equals(userId)) {
			throw ApiException.notFound();
		}
		else if (!in.updatedAt().isAfter(athlete.getUpdatedAt())) {
			return AthleteDto.of(athlete);
		}
		athlete.apply(in.name().trim(), in.ageGroup(), in.level(), in.language(), in.updatedAt());
		return AthleteDto.of(athletes.save(athlete));
	}

}
