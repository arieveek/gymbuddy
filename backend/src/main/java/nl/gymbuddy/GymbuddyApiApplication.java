package nl.gymbuddy;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class GymbuddyApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(GymbuddyApiApplication.class, args);
	}

}
