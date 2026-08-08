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

# JVM 옵션은 Render 무료 티어(512MB / 0.1 CPU)에 맞춘 것 —
# 기본값으로는 기동이 너무 느려 Render의 포트 감지 시간을 넘겨 배포가 실패한다.
#   MaxRAMPercentage=50  컨테이너 메모리 기준 힙 상한(나머지는 메타스페이스·네이티브·스택)
#   UseSerialGC          코어가 1개도 안 되는 환경에선 병렬 GC의 스레드 오버헤드가 손해
#   TieredStopAtLevel=1  C2 JIT를 끄고 C1만 — 기동 중 JIT가 CPU를 뺏는 걸 막는다.
#                        지속 성능은 낮아지지만 저트래픽 사이트에선 기동 속도가 더 중요.
ENTRYPOINT ["sh", "-c", "java -XX:MaxRAMPercentage=50 -XX:+UseSerialGC -XX:TieredStopAtLevel=1 -Dspring.jmx.enabled=false -jar app.jar --spring.profiles.active=prod --server.port=$PORT"]
