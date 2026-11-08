package nl.gymbuddy.auth;

import nl.gymbuddy.config.GymbuddyProperties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Creates the admin account from GYMBUDDY_ADMIN_EMAIL / GYMBUDDY_ADMIN_PASSWORD on startup.
 * Nobody becomes admin by registering: an existing non-admin account with that email is never promoted.
 */
@Component
public class AdminBootstrap implements ApplicationRunner {

	private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

	private final UserRepository users;
	private final PasswordEncoder passwordEncoder;
	private final GymbuddyProperties props;

	public AdminBootstrap(UserRepository users, PasswordEncoder passwordEncoder, GymbuddyProperties props) {
		this.users = users;
		this.passwordEncoder = passwordEncoder;
		this.props = props;
	}

	@Override
	@Transactional
	public void run(ApplicationArguments args) {
		String email = props.adminEmail() == null ? "" : AuthService.normalize(props.adminEmail());
		if (email.isEmpty()) {
			log.warn("GYMBUDDY_ADMIN_EMAIL is not set: there is no admin to approve new accounts");
			return;
		}
		users.findByEmail(email).ifPresentOrElse(existing -> {
			if (!existing.isAdmin()) {
				log.error("An ordinary account already uses the admin email {}; it was NOT made admin. Delete it or choose another admin email.", email);
			}
		}, () -> {
			String password = props.adminPassword();
			if (password == null || password.length() < 12) {
				log.error("GYMBUDDY_ADMIN_PASSWORD must be at least 12 characters; the admin account was not created");
				return;
			}
			users.save(User.admin(email, passwordEncoder.encode(password)));
			log.info("Created admin account {}", email);
		});
	}

}
