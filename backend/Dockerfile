FROM eclipse-temurin:25-jdk-alpine

# curl для healthcheck, bash для gradlew
RUN apk add --no-cache curl bash

WORKDIR /app

EXPOSE 8080

# chmod на всякий случай (если с Мака файл пришёл без +x бита)
ENTRYPOINT ["sh", "-c", "chmod +x ./gradlew && exec ./gradlew bootRun"]