package nl.gymbuddy;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.UUID;

import org.junit.jupiter.api.Test;

class TrainingIntegrationTest extends ApiTestSupport {

	private static String sessionJson(UUID id) {
		return """
				{"id":"%s","date":"2026-11-02","level":2,"step":1,"lightWeek":false,"repsTotal":24,"holdSecondsTotal":90,"createdAt":"2026-11-02T16:00:00Z"}
				""".formatted(id);
	}

	private static String testJson(UUID id, int pullups) {
		return "{\"id\":\"%s\",\"date\":\"2026-11-03\",\"pullups\":%d,\"hangSeconds\":12}".formatted(id, pullups);
	}

	@Test
	void profileRoundTrip() throws Exception {
		Tokens t = register(uniqueEmail());
		UUID id = createAthlete(t.access());
		getWith("/api/athletes", t.access())
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].id").value(id.toString()))
				.andExpect(jsonPath("$[0].name").value("Daan"))
				.andExpect(jsonPath("$[0].ageGroup").value("child"))
				.andExpect(jsonPath("$[0].language").value("nl"));
	}

	@Test
	void injuriesAreStoredWithTheProfile() throws Exception {
		Tokens t = register(uniqueEmail());
		UUID id = createAthlete(t.access());
		getWith("/api/athletes", t.access()).andExpect(jsonPath("$[0].injuries", hasSize(0)));
		putJson("/api/athletes/" + id, """
				{"id":"%s","name":"Daan","ageGroup":"child","level":2,"language":"nl","injuries":["wrist","knee"],"updatedAt":"2026-11-06T10:00:00Z"}
				""".formatted(id), t.access())
				.andExpect(status().isOk()).andExpect(jsonPath("$.injuries", hasSize(2))).andExpect(jsonPath("$.injuries[0]").value("wrist"));
		getWith("/api/athletes", t.access()).andExpect(jsonPath("$[0].injuries[1]").value("knee"));
		// Healed: an empty list clears them.
		putJson("/api/athletes/" + id, """
				{"id":"%s","name":"Daan","ageGroup":"child","level":2,"language":"nl","injuries":[],"updatedAt":"2026-11-07T10:00:00Z"}
				""".formatted(id), t.access())
				.andExpect(jsonPath("$.injuries", hasSize(0)));
		// Unknown body areas are rejected.
		putJson("/api/athletes/" + id, """
				{"id":"%s","name":"Daan","ageGroup":"child","level":2,"language":"nl","injuries":["nose"],"updatedAt":"2026-11-08T10:00:00Z"}
				""".formatted(id), t.access())
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
	}

	@Test
	void newerProfileWinsAndOlderIsIgnored() throws Exception {
		Tokens t = register(uniqueEmail());
		UUID id = createAthlete(t.access());
		putJson("/api/athletes/" + id, athleteJson(id, "Daan", 3, "2026-11-05T10:00:00Z"), t.access())
				.andExpect(status().isOk()).andExpect(jsonPath("$.level").value(3));
		// A device that was offline sends an older copy: the newer one stays.
		putJson("/api/athletes/" + id, athleteJson(id, "Old", 1, "2026-11-04T10:00:00Z"), t.access())
				.andExpect(status().isOk()).andExpect(jsonPath("$.level").value(3)).andExpect(jsonPath("$.name").value("Daan"));
	}

	@Test
	void sessionsAndTestsAreStoredOnceWhenSyncedTwice() throws Exception {
		Tokens t = register(uniqueEmail());
		UUID athlete = createAthlete(t.access());
		UUID session = UUID.randomUUID();
		String url = "/api/athletes/" + athlete + "/sessions";

		postJson(url, sessionJson(session), t.access()).andExpect(status().isCreated());
		postJson(url, sessionJson(session), t.access()).andExpect(status().isOk());
		getWith(url, t.access()).andExpect(jsonPath("$", hasSize(1))).andExpect(jsonPath("$[0].repsTotal").value(24));

		UUID test = UUID.randomUUID();
		String testsUrl = "/api/athletes/" + athlete + "/tests";
		postJson(testsUrl, testJson(test, 3), t.access()).andExpect(status().isCreated());
		postJson(testsUrl, testJson(test, 3), t.access()).andExpect(status().isOk());
		getWith(testsUrl, t.access()).andExpect(jsonPath("$", hasSize(1))).andExpect(jsonPath("$[0].pullups").value(3));
	}

	@Test
	void anotherFamilysDataIsInvisible() throws Exception {
		Tokens owner = register(uniqueEmail());
		Tokens other = register(uniqueEmail());
		UUID athlete = createAthlete(owner.access());
		UUID session = UUID.randomUUID();
		postJson("/api/athletes/" + athlete + "/sessions", sessionJson(session), owner.access()).andExpect(status().isCreated());

		getWith("/api/athletes", other.access()).andExpect(jsonPath("$", hasSize(0)));
		getWith("/api/athletes/" + athlete + "/sessions", other.access())
				.andExpect(status().isNotFound()).andExpect(jsonPath("$.code").value("NOT_FOUND"));
		getWith("/api/athletes/" + athlete + "/tests", other.access()).andExpect(status().isNotFound());
		postJson("/api/athletes/" + athlete + "/sessions", sessionJson(UUID.randomUUID()), other.access()).andExpect(status().isNotFound());
		putJson("/api/athletes/" + athlete, athleteJson(athlete, "Taken", 5, "2030-01-01T00:00:00Z"), other.access())
				.andExpect(status().isNotFound());
		// Re-using someone else's athlete id to "create" a profile does not take it over either.
		postJson("/api/athletes", athleteJson(athlete, "Taken", 5, "2030-01-01T00:00:00Z"), other.access()).andExpect(status().isNotFound());

		// A session id that belongs to the owner's athlete cannot be attached to the other user's athlete.
		UUID otherAthlete = createAthlete(other.access());
		postJson("/api/athletes/" + otherAthlete + "/sessions", sessionJson(session), other.access()).andExpect(status().isNotFound());

		getWith("/api/athletes/" + athlete + "/sessions", owner.access()).andExpect(jsonPath("$", hasSize(1)));
	}

	@Test
	void invalidRecordsAreRejected() throws Exception {
		Tokens t = register(uniqueEmail());
		UUID athlete = createAthlete(t.access());
		postJson("/api/athletes", "{\"id\":\"%s\",\"name\":\"X\",\"ageGroup\":\"teen\",\"level\":1,\"language\":\"nl\",\"updatedAt\":\"2026-11-01T10:00:00Z\"}"
				.formatted(UUID.randomUUID()), t.access())
				.andExpect(status().isBadRequest()).andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
		postJson("/api/athletes", athleteJson(UUID.randomUUID(), "Daan", 6, "2026-11-01T10:00:00Z"), t.access())
				.andExpect(status().isBadRequest());
		postJson("/api/athletes/" + athlete + "/tests", testJson(UUID.randomUUID(), -1), t.access())
				.andExpect(status().isBadRequest());
		getWith("/api/athletes/not-a-uuid/tests", t.access()).andExpect(status().isBadRequest());
	}

}
