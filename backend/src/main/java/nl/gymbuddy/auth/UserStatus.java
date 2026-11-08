package nl.gymbuddy.auth;

/** Lower-case names: stored as-is in users.status and sent as-is in JSON. */
public enum UserStatus {
	/** Registered, waiting for the admin. Cannot log in. */
	pending,
	/** Approved by the admin. */
	approved,
	/** Access withdrawn by the admin. Existing tokens stop working on the next request. */
	blocked
}
