# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace
# Use repo root as context so parent POM is available
COPY . .
RUN mvn -q -DskipTests -pl eureka-server -am package

# ---- Run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
# security: non-root user
RUN useradd -ms /bin/bash app
USER app
ENV SERVER_PORT=8761
EXPOSE 8761
COPY --from=build /workspace/eureka-server/target/*.jar /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
