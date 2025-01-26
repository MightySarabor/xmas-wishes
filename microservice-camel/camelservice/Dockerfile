# Base image for Java
FROM openjdk:11-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the JAR file into the container
COPY target/camelservice-1.0-SNAPSHOT.jar app.jar

# Expose port for debugging (optional)
EXPOSE 8080

# Run the application
ENTRYPOINT ["java", "-jar", "app.jar"]
