package nl.gymbuddy.auth;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/** The parent account. One per family; the child has no login of their own. Only approved accounts can use the app. */
@Entity
@Table(name = "users")
public class User {

	@Id
	private UUID id;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(name = "password_hash", nullable = false)
	private String passwordHash;

	@Column(name = "created_at", nullable = false)
	private Instant createdAt;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private UserRole role = UserRole.user;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private UserStatus status = UserStatus.pending;

	@Column(name = "approved_at")
	private Instant approvedAt;

	protected User() {
	}

	public User(String email, String passwordHash) {
		this.id = UUID.randomUUID();
		this.email = email;
		this.passwordHash = passwordHash;
		this.createdAt = Instant.now();
	}

	public static User admin(String email, String passwordHash) {
		User u = new User(email, passwordHash);
		u.role = UserRole.admin;
		u.approve();
		return u;
	}

	public void approve() {
		status = UserStatus.approved;
		approvedAt = Instant.now();
	}

	public void block() {
		status = UserStatus.blocked;
	}

	public boolean isApproved() {
		return status == UserStatus.approved;
	}

	public boolean isAdmin() {
		return role == UserRole.admin;
	}

	public UUID getId() {
		return id;
	}

	public String getEmail() {
		return email;
	}

	public String getPasswordHash() {
		return passwordHash;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public UserRole getRole() {
		return role;
	}

	public UserStatus getStatus() {
		return status;
	}

	public Instant getApprovedAt() {
		return approvedAt;
	}

}
