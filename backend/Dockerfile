# GymBuddy API: build with the Maven wrapper, run on a slim JRE as a non-root user.
FROM eclipse-temurin:21-jdk AS build
WORKDIR /src
COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw -B -q dependency:go-offline
COPY src src
# Tests run in CI (they need Docker for Testcontainers), not inside the image build.
RUN ./mvnw -B -q package -DskipTests && cp target/gymbuddy-api-*.jar /app.jar

FROM eclipse-temurin:21-jre
RUN useradd --system --uid 10001 gymbuddy
WORKDIR /app
COPY --from=build /app.jar app.jar
USER gymbuddy
EXPOSE 8080
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=75", "-jar", "app.jar"]
