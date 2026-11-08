package nl.gymbuddy;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;

class AuthIntegrationTest extends ApiTestSupport {

	@Test
	void registerReturnsTokensThatOpenTheApi() throws Exception {
		Tokens t = register(uniqueEmail());
		getWith("/api/athletes", t.access()).andExpect(status().isOk()).andExpect(jsonPath("$").isArray());
	}

	@Test
	void apiNeedsAToken() throws Exception {
		mvc.perform(get("/api/athletes")).andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("UNAUTHORIZED"));
		getWith("/api/athletes", "not-a-jwt").andExpect(status().isUnauthorized());
	}

	@Test
	void healthIsOpen() throws Exception {
		mvc.perform(get("/actuator/health")).andExpect(status().isOk());
	}

	@Test
	void duplicateEmailIsRejectedCaseInsensitively() throws Exception {
		String email = uniqueEmail();
		register(email);
		postJson("/api/auth/register", "{\"email\":\"%s\",\"password\":\"another one\"}".formatted(email.toUpperCase()))
				.andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("EMAIL_TAKEN"));
	}

	@Test
	void loginChecksThePassword() throws Exception {
		String email = uniqueEmail();
		register(email);
		postJson("/api/auth/login", "{\"email\":\"%s\",\"password\":\"correct horse\"}".formatted(email))
				.andExpect(status().isOk()).andExpect(jsonPath("$.accessToken").isString());
		postJson("/api/auth/login", "{\"email\":\"%s\",\"password\":\"wrong\"}".formatted(email))
				.andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
		postJson("/api/auth/login", "{\"email\":\"nobody@example.com\",\"password\":\"whatever\"}")
				.andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
	}

	@Test
	void refreshRotatesTheToken() throws Exception {
		Tokens first = register(uniqueEmail());
		String body = postJson("/api/auth/refresh", "{\"refreshToken\":\"%s\"}".formatted(first.refresh()))
				.andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
		Tokens second = tokens(body);
		assertThat(second.refresh()).isNotEqualTo(first.refresh());
		getWith("/api/athletes", second.access()).andExpect(status().isOk());
	}

	@Test
	void reusingARefreshTokenRevokesTheWholeAccount() throws Exception {
		Tokens first = register(uniqueEmail());
		Tokens second = tokens(postJson("/api/auth/refresh", "{\"refreshToken\":\"%s\"}".formatted(first.refresh()))
				.andReturn().getResponse().getContentAsString());

		// The old token shows up again: someone copied it.
		postJson("/api/auth/refresh", "{\"refreshToken\":\"%s\"}".formatted(first.refresh()))
				.andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("INVALID_REFRESH_TOKEN"));
		// So the legitimate newer token is revoked as well.
		postJson("/api/auth/refresh", "{\"refreshToken\":\"%s\"}".formatted(second.refresh()))
				.andExpect(status().isUnauthorized());
	}

	@Test
	void logoutRevokesTheRefreshToken() throws Exception {
		Tokens t = register(uniqueEmail());
		postJson("/api/auth/logout", "{\"refreshToken\":\"%s\"}".formatted(t.refresh())).andExpect(status().isNoContent());
		postJson("/api/auth/refresh", "{\"refreshToken\":\"%s\"}".formatted(t.refresh())).andExpect(status().isUnauthorized());
	}

	@Test
	void invalidInputGivesAValidationCode() throws Exception {
		postJson("/api/auth/register", "{\"email\":\"not-an-email\",\"password\":\"long enough\"}")
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
		postJson("/api/auth/register", "{\"email\":\"%s\",\"password\":\"short\"}".formatted(uniqueEmail()))
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
		postJson("/api/auth/register", "not json").andExpect(status().isBadRequest());
	}

}
