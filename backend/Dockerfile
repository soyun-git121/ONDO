# Render용 백엔드 단독 이미지 (프론트는 Vercel에 따로 배포).
# Render 설정: Root Directory = backend, Runtime = Docker
#
# 루트의 Dockerfile은 프론트를 번들해 한 서버로 띄우는 "단일 서버" 배포용이다.
# 이 파일은 프론트/백을 분리 배포할 때 쓴다.

FROM eclipse-temurin:17-jdk AS build
WORKDIR /be
COPY . .
RUN chmod +x ./gradlew && ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /be/build/libs/ondo-backend-0.0.1-SNAPSHOT.jar app.jar
RUN mkdir -p /app/uploads

# Render는 PORT 환경변수로 포트를 지정한다(기본 8080).
ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -jar app.jar --spring.profiles.active=prod --server.port=$PORT"]
