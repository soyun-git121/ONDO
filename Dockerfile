# 프론트(React)를 백엔드(Spring Boot) jar 안에 번들 → 이미지 1개가 사이트+API를 모두 제공.
# 빌드 컨텍스트는 저장소 루트. VM에서 그대로 빌드하면 해당 아키텍처(ARM/AMD)로 네이티브 빌드된다.

# 1) 프론트 빌드 → dist
FROM node:20-alpine AS frontend
WORKDIR /fe
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# 2) 백엔드 빌드 (프론트 dist를 정적 리소스로 포함)
FROM eclipse-temurin:17-jdk AS backend
WORKDIR /be
COPY backend/ ./
COPY --from=frontend /fe/dist/ ./src/main/resources/static/
RUN chmod +x ./gradlew && ./gradlew bootJar --no-daemon -x test

# 3) 런타임 (JRE만 — 이미지 경량화)
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=backend /be/build/libs/ondo-backend-0.0.1-SNAPSHOT.jar app.jar
# 업로드 이미지는 볼륨으로 마운트되는 경로(운영 compose의 UPLOAD_DIR과 일치)
RUN mkdir -p /app/uploads
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]
