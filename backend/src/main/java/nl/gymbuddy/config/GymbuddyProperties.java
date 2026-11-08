package nl.gymbuddy.config;

import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.List;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.bind.DefaultValue;

/**
 * @param rememberMeTtl how long a "keep me logged in" login lasts after the app was last opened (sliding)
 * @param sessionTtl    the most a login without "keep me logged in" lasts (the app also forgets it when closed)
 * @param adminEmail    account created as the approved admin at startup, if it does not exist yet
 * @param adminPassword initial password for that account (only used when creating it)
 */
@ConfigurationProperties("gymbuddy")
public record GymbuddyProperties(
		String jwtSecret,
		@DefaultValue("http://localhost:3000") List<String> corsOrigins,
		@DefaultValue("15m") Duration accessTokenTtl,
		@DefaultValue("30d") Duration rememberMeTtl,
		@DefaultValue("12h") Duration sessionTtl,
		String adminEmail,
		String adminPassword) {

	public GymbuddyProperties {
		if (jwtSecret == null || jwtSecret.getBytes(StandardCharsets.UTF_8).length < 32) {
			throw new IllegalStateException("gymbuddy.jwt-secret (GYMBUDDY_JWT_SECRET) must be set to at least 32 bytes");
		}
	}

}
