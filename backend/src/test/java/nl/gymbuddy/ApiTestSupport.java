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

	protected Tokens register(String email) throws Exception {
		String body = postJson("/api/auth/register", "{\"email\":\"%s\",\"password\":\"correct horse\"}".formatted(email))
				.andReturn().getResponse().getContentAsString();
		return tokens(body);
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
