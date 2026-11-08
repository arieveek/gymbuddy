package nl.gymbuddy.training;

import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

/** Callers check athlete ownership first (AthleteService.owned) before reading or writing through this. */
public interface TestResultRepository extends JpaRepository<TestResult, UUID> {

	List<TestResult> findAllByAthleteIdOrderByDateAscCreatedAtAsc(UUID athleteId);

}
