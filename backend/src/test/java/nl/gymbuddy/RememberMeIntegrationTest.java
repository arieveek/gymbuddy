package nl.gymbuddy;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

import com.jayway.jsonpath.JsonPath;
import nl.gymbuddy.auth.AuthService;
import nl.gymbuddy.auth.RefreshToken;
import nl.gymbuddy.auth.RefreshTokenRepository;
import org.junit.jupiter.api.Test;

import org.springframework.beans.factory.annotation.Autowired;

class RememberMeIntegrationTest extends ApiTestSupport {

	private static final long THIRTY_DAYS = Duration.ofDays(30).toSeconds();
	private static final long TWELVE_HOURS = Duration.ofHours(12).toSeconds();

	@Autowired
	RefreshTokenRepository tokens;

	@Autowired
	AuthService auth;

	private String login(String email, boolean remember) throws Exception {
		return postJson("/api/auth/login", "{\"email\":\"%s\",\"password\":\"%s\",\"rememberMe\":%s}".formatted(email, PASSWORD, remember))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
	}

	private String refresh(String body) throws Exception {
		String token = JsonPath.read(body, "$.refreshToken");
		return postJson("/api/auth/refresh", "{\"refreshToken\":\"%s\"}".formatted(token))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
	}

	@Test
	void keepMeLoggedInLastsThirtyDaysAndStartsOverOnEveryRefresh() throws Exception {
		String email = uniqueEmail();
		register(email);
		String first = login(email, true);
		assertThat(((Number) JsonPath.read(first, "$.refreshExpiresIn")).longValue()).isEqualTo(THIRTY_DAYS);
		assertThat((Boolean) JsonPath.read(first, "$.remember")).isTrue();

		// Opening the app again refreshes: the new token gets the full 30 days again, still as "remember me".
		String second = refresh(first);
		assertThat(((Number) JsonPath.read(second, "$.refreshExpiresIn")).longValue()).isEqualTo(THIRTY_DAYS);
		assertThat((Boolean) JsonPath.read(second, "$.remember")).isTrue();
		String third = refresh(second);
		assertThat((Boolean) JsonPath.read(third, "$.remember")).isTrue();
	}

	@Test
	void withoutKeepMeLoggedInTheLoginIsShortAndStaysShort() throws Exception {
		String email = uniqueEmail();
		register(email);
		String first = login(email, false);
		assertThat(((Number) JsonPath.read(first, "$.refreshExpiresIn")).longValue()).isEqualTo(TWELVE_HOURS);
		String second = refresh(first);
		assertThat(((Number) JsonPath.read(second, "$.refreshExpiresIn")).longValue()).isEqualTo(TWELVE_HOURS);
		assertThat((Boolean) JsonPath.read(second, "$.remember")).isFalse();
	}

	@Test
	void leavingOutRememberMeMeansNo() throws Exception {
		String email = uniqueEmail();
		register(email);
		postJson("/api/auth/login", "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, PASSWORD))
				.andExpect(status().isOk()).andExpect(jsonPath("$.remember").value(false));
	}

	@Test
	void expiredTokensAreCleanedUp() throws Exception {
		Tokens user = register(uniqueEmail());
		UUID userId = UUID.fromString(JsonPath.read(getWith("/api/me", user.access()).andReturn().getResponse().getContentAsString(), "$.id"));
		RefreshToken expired = tokens.save(new RefreshToken(userId, "x".repeat(63) + "1", Instant.now().minusSeconds(60), true));

		assertThat(auth.purgeExpiredTokens()).isGreaterThanOrEqualTo(1);
		assertThat(tokens.findByTokenHash("x".repeat(63) + "1")).isEmpty();
		// The user's live token is untouched.
		postJson("/api/auth/refresh", "{\"refreshToken\":\"%s\"}".formatted(user.refresh())).andExpect(status().isOk());
		assertThat(expired).isNotNull();
	}

}
