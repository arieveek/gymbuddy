package nl.gymbuddy;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;

import java.util.UUID;

import com.jayway.jsonpath.JsonPath;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

/** Full application against PostgreSQL in Docker, driven over HTTP with MockMvc. */
@SpringBootTest
@AutoConfigureMockMvc
@Import(TestcontainersConfiguration.class)
abstract class ApiTestSupport {

	@Autowired
	protected MockMvc mvc;

	record Tokens(String access, String refresh) {
	}

	protected static String uniqueEmail() {
		return "parent-" + UUID.randomUUID() + "@example.com";
	}

	protected ResultActions postJson(String url, String json) throws Exception {
		return mvc.perform(post(url).contentType(MediaType.APPLICATION_JSON).content(json));
	}

	protected ResultActions postJson(String url, String json, String token) throws Exception {
		return mvc.perform(post(url).header("Authorization", "Bearer " + token).contentType(MediaType.APPLICATION_JSON).content(json));
	}

	protected ResultActions putJson(String url, String json, String token) throws Exception {
		return mvc.perform(put(url).header("Authorization", "Bearer " + token).contentType(MediaType.APPLICATION_JSON).content(json));
	}

	protected ResultActions getWith(String url, String token) throws Exception {
		return mvc.perform(get(url).header("Authorization", "Bearer " + token));
	}

	protected static final String ADMIN_EMAIL = "admin@example.com";
	protected static final String ADMIN_PASSWORD = "admin-password-for-tests";
	protected static final String PASSWORD = "correct horse";

	protected Tokens login(String email, String password) throws Exception {
		return tokens(postJson("/api/auth/login", "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, password))
				.andReturn().getResponse().getContentAsString());
	}

	protected Tokens admin() throws Exception {
		return login(ADMIN_EMAIL, ADMIN_PASSWORD);
	}

	/** Registers a pending account and returns its id (looked up through the admin list). */
	protected String registerPending(String email) throws Exception {
		postJson("/api/auth/register", "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, PASSWORD));
		String list = getWith("/api/admin/users", admin().access()).andReturn().getResponse().getContentAsString();
		java.util.List<String> ids = JsonPath.read(list, "$[?(@.email == '" + email.toLowerCase() + "')].id");
		return ids.get(0);
	}

	/** Registers, has the admin approve, and logs in: an ordinary usable account. */
	protected Tokens register(String email) throws Exception {
		String id = registerPending(email);
		postJson("/api/admin/users/" + id + "/approve", "", admin().access());
		return login(email, PASSWORD);
	}

	protected static Tokens tokens(String body) {
		return new Tokens(JsonPath.read(body, "$.accessToken"), JsonPath.read(body, "$.refreshToken"));
	}

	protected static String athleteJson(UUID id, String name, int level, String updatedAt) {
		return """
				{"id":"%s","name":"%s","ageGroup":"child","level":%d,"language":"nl","updatedAt":"%s"}
				""".formatted(id, name, level, updatedAt);
	}

	protected UUID createAthlete(String token) throws Exception {
		UUID id = UUID.randomUUID();
		postJson("/api/athletes", athleteJson(id, "Daan", 1, "2026-11-01T10:00:00Z"), token);
		return id;
	}

}
