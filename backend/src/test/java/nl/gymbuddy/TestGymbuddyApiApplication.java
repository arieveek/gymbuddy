package nl.gymbuddy;

import org.springframework.boot.SpringApplication;

public class TestGymbuddyApiApplication {

	public static void main(String[] args) {
		SpringApplication.from(GymbuddyApiApplication::main).with(TestcontainersConfiguration.class).run(args);
	}

}
