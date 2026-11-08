package nl.gymbuddy;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;

class AdminIntegrationTest extends ApiTestSupport {

	private static String creds(String email, String password) {
		return "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, password);
	}

	@Test
	void adminIsCreatedFromConfiguration() throws Exception {
		getWith("/api/me", admin().access()).andExpect(status().isOk())
				.andExpect(jsonPath("$.role").value("admin")).andExpect(jsonPath("$.status").value("approved"));
	}

	@Test
	void registrationWaitsForApproval() throws Exception {
		String email = uniqueEmail();
		postJson("/api/auth/register", creds(email, PASSWORD))
				.andExpect(status().isAccepted())
				.andExpect(jsonPath("$.status").value("pending"))
				.andExpect(jsonPath("$.accessToken").doesNotExist());
		postJson("/api/auth/login", creds(email, PASSWORD))
				.andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("ACCOUNT_PENDING"));
		// A wrong password does not reveal that the account exists and is pending.
		postJson("/api/auth/login", creds(email, "wrong password"))
				.andExpect(status().isUnauthorized()).andExpect(jsonPath("$.code").value("INVALID_CREDENTIALS"));
	}

	@Test
	void adminApprovesAndTheAccountCanLogIn() throws Exception {
		String email = uniqueEmail();
		String id = registerPending(email);
		getWith("/api/admin/users", admin().access())
				.andExpect(jsonPath("$[0].status").value("pending")); // pending accounts are listed first
		postJson("/api/admin/users/" + id + "/approve", "", admin().access())
				.andExpect(status().isOk()).andExpect(jsonPath("$.status").value("approved"));
		postJson("/api/auth/login", creds(email, PASSWORD)).andExpect(status().isOk());
	}

	@Test
	void blockingTakesEffectImmediately() throws Exception {
		String email = uniqueEmail();
		Tokens user = register(email);
		String id = JsonPath.read(getWith("/api/me", user.access()).andReturn().getResponse().getContentAsString(), "$.id");

		postJson("/api/admin/users/" + id + "/block", "", admin().access())
				.andExpect(status().isOk()).andExpect(jsonPath("$.status").value("blocked"));

		// The still-valid access token is refused on the very next request.
		getWith("/api/athletes", user.access())
				.andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("ACCOUNT_NOT_APPROVED"));
		postJson("/api/auth/refresh", "{\"refreshToken\":\"%s\"}".formatted(user.refresh())).andExpect(status().isUnauthorized());
		postJson("/api/auth/login", creds(email, PASSWORD))
				.andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("ACCOUNT_BLOCKED"));

		// Approving again restores access.
		postJson("/api/admin/users/" + id + "/approve", "", admin().access()).andExpect(status().isOk());
		postJson("/api/auth/login", creds(email, PASSWORD)).andExpect(status().isOk());
	}

	@Test
	void deletingRemovesTheAccountAndItsData() throws Exception {
		String email = uniqueEmail();
		Tokens user = register(email);
		createAthlete(user.access());
		String id = JsonPath.read(getWith("/api/me", user.access()).andReturn().getResponse().getContentAsString(), "$.id");

		mvc.perform(delete("/api/admin/users/" + id).header("Authorization", "Bearer " + admin().access()))
				.andExpect(status().isNoContent());
		getWith("/api/athletes", user.access()).andExpect(status().isForbidden());
		postJson("/api/auth/login", creds(email, PASSWORD)).andExpect(status().isUnauthorized());
		// The email is free again.
		postJson("/api/auth/register", creds(email, PASSWORD)).andExpect(status().isAccepted());
	}

	@Test
	void onlyTheAdminReachesTheAdminApi() throws Exception {
		Tokens user = register(uniqueEmail());
		getWith("/api/admin/users", user.access())
				.andExpect(status().isForbidden()).andExpect(jsonPath("$.code").value("FORBIDDEN"));
	}

	@Test
	void adminCannotLockThemselvesOut() throws Exception {
		Tokens admin = admin();
		String id = JsonPath.read(getWith("/api/me", admin.access()).andReturn().getResponse().getContentAsString(), "$.id");
		postJson("/api/admin/users/" + id + "/block", "", admin.access())
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("CANNOT_CHANGE_SELF"));
		getWith("/api/me", admin.access()).andExpect(status().isOk());
	}

	@Test
	void registeringWithTheAdminEmailDoesNotMakeAnAdmin() throws Exception {
		postJson("/api/auth/register", creds(ADMIN_EMAIL, "attacker password"))
				.andExpect(status().isConflict()).andExpect(jsonPath("$.code").value("EMAIL_TAKEN"));
		getWith("/api/admin/users", admin().access()).andExpect(jsonPath("$[?(@.role == 'admin')]", hasSize(1)));
	}

}
