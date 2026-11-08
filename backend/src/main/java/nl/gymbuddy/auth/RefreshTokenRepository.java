package nl.gymbuddy.auth;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {

	Optional<RefreshToken> findByTokenHash(String tokenHash);

	@Modifying
	@Query("update RefreshToken t set t.revokedAt = :now where t.userId = :userId and t.revokedAt is null")
	int revokeAllForUser(UUID userId, Instant now);

	/** Expired tokens are useless (revoked ones are kept until they expire, for reuse detection). */
	@Modifying
	@Query("delete from RefreshToken t where t.expiresAt < :now")
	int deleteExpired(Instant now);

}
