package nl.gymbuddy.auth;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** A long-lived token for one device, stored as a SHA-256 hash so it can be revoked. */
@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {

	@Id
	private UUID id;

	@Column(name = "user_id", nullable = false)
	private UUID userId;

	@Column(name = "token_hash", nullable = false, unique = true)
	private String tokenHash;

	@Column(name = "expires_at", nullable = false)
	private Instant expiresAt;

	@Column(name = "revoked_at")
	private Instant revokedAt;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	/** "Keep me logged in": the rotated token gets the long lifetime again, so it slides with use. */
	@Column(nullable = false)
	private boolean remember;

	protected RefreshToken() {
	}

	public RefreshToken(UUID userId, String tokenHash, Instant expiresAt, boolean remember) {
		this.id = UUID.randomUUID();
		this.userId = userId;
		this.tokenHash = tokenHash;
		this.expiresAt = expiresAt;
		this.remember = remember;
		this.createdAt = Instant.now();
	}

	public UUID getUserId() {
		return userId;
	}

	public boolean isRemember() {
		return remember;
	}

	public boolean isRevoked() {
		return revokedAt != null;
	}

	public boolean isExpired(Instant now) {
		return !expiresAt.isAfter(now);
	}

	public void revoke(Instant now) {
		if (revokedAt == null) {
			revokedAt = now;
		}
	}

}
