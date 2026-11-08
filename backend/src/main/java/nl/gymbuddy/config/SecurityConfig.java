package nl.gymbuddy.config;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import com.nimbusds.jose.jwk.source.ImmutableSecret;
import jakarta.servlet.http.HttpServletResponse;
import nl.gymbuddy.auth.AccountAuthenticationConverter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.JwtEncoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

/**
 * Stateless API secured with bearer tokens the API issues itself (HS256 JWTs).
 * Bearer tokens, not cookies: the Capacitor app runs from capacitor://localhost, where cookies are unreliable.
 */
@Configuration
public class SecurityConfig {

	static final String CAPACITOR_ORIGIN = "capacitor://localhost";

	/**
	 * Only approved accounts (ROLE_USER) reach the API; /api/admin needs ROLE_ADMIN as well.
	 * A valid token of a pending, blocked or deleted account gets 403 ACCOUNT_NOT_APPROVED, so the app can sign out.
	 */
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http, AccountAuthenticationConverter accounts) throws Exception {
		AuthenticationEntryPoint unauthorized = (request, response, ex) -> writeCode(response, HttpServletResponse.SC_UNAUTHORIZED, "UNAUTHORIZED");
		AccessDeniedHandler denied = (request, response, ex) -> {
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			boolean approved = auth != null && auth.getAuthorities().stream().anyMatch(a -> "ROLE_USER".equals(a.getAuthority()));
			writeCode(response, HttpServletResponse.SC_FORBIDDEN, approved ? "FORBIDDEN" : "ACCOUNT_NOT_APPROVED");
		};
		return http
				.csrf(AbstractHttpConfigurer::disable)
				.cors(Customizer.withDefaults())
				.sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.authorizeHttpRequests(a -> a
						.requestMatchers("/api/auth/**", "/actuator/health", "/actuator/health/**", "/error").permitAll()
						.requestMatchers("/api/admin/**").hasRole("ADMIN")
						.anyRequest().hasRole("USER"))
				.oauth2ResourceServer(o -> o.jwt(j -> j.jwtAuthenticationConverter(accounts)).authenticationEntryPoint(unauthorized))
				.exceptionHandling(e -> e.authenticationEntryPoint(unauthorized).accessDeniedHandler(denied))
				.build();
	}

	private static void writeCode(HttpServletResponse response, int status, String code) throws IOException {
		response.setStatus(status);
		response.setContentType(MediaType.APPLICATION_JSON_VALUE);
		response.getWriter().write("{\"code\":\"" + code + "\"}");
	}

	@Bean
	SecretKey jwtKey(GymbuddyProperties props) {
		return new SecretKeySpec(props.jwtSecret().getBytes(StandardCharsets.UTF_8), "HmacSHA256");
	}

	@Bean
	JwtEncoder jwtEncoder(SecretKey jwtKey) {
		return new NimbusJwtEncoder(new ImmutableSecret<>(jwtKey));
	}

	@Bean
	JwtDecoder jwtDecoder(SecretKey jwtKey) {
		return NimbusJwtDecoder.withSecretKey(jwtKey).macAlgorithm(MacAlgorithm.HS256).build();
	}

	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}

	@Bean
	CorsConfigurationSource corsConfigurationSource(GymbuddyProperties props) {
		List<String> origins = new ArrayList<>(props.corsOrigins());
		origins.add(CAPACITOR_ORIGIN);
		CorsConfiguration cors = new CorsConfiguration();
		cors.setAllowedOrigins(origins);
		cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
		cors.setAllowedHeaders(List.of("Authorization", "Content-Type"));
		cors.setMaxAge(3600L);
		UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
		source.registerCorsConfiguration("/api/**", cors);
		return source;
	}

}
