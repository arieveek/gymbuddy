package nl.gymbuddy.training;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

/** Callers check athlete ownership first (AthleteService.owned) before reading or writing through this. */
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, UUID> {

	List<WorkoutSession> findAllByAthleteIdOrderByDateAscCreatedAtAsc(UUID athleteId);

}
