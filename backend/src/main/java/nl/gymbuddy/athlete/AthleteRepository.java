package nl.gymbuddy.athlete;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

/** Every lookup is scoped to the signed-in user; there is deliberately no public find-by-id-alone. */
public interface AthleteRepository extends JpaRepository<Athlete, UUID> {

	Optional<Athlete> findByIdAndUserId(UUID id, UUID userId);

	List<Athlete> findAllByUserIdOrderByName(UUID userId);

}
