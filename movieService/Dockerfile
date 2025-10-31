# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY . .
RUN mvn -q -DskipTests -pl movieService -am package

# ---- Run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd -ms /bin/bash app
USER app
# Default port overrideable at runtime
ENV SERVER_PORT=8082
EXPOSE 8082
COPY --from=build /workspace/movieService/target/*.jar /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
