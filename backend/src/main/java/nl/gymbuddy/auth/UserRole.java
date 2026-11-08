package nl.gymbuddy.auth;

/** Lower-case names: stored as-is in users.role and sent as-is in JSON. */
public enum UserRole {
	user,
	/** Can approve, block and delete accounts. Created from GYMBUDDY_ADMIN_EMAIL at startup, never by registering. */
	admin
}
