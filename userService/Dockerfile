# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /workspace
COPY . .
RUN mvn -q -DskipTests -pl userService -am package

# ---- Run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
RUN useradd -ms /bin/bash app
USER app
ENV SERVER_PORT=8083
EXPOSE 8083
COPY --from=build /workspace/userService/target/*.jar /app/app.jar
ENTRYPOINT ["java","-jar","/app/app.jar"]
