# ONDO — 전통문화 소속사 웹사이트

무형유산 보유자의 브랜딩·상품·협업을 시장과 연결하는 ONDO의 공식 웹사이트.

## 문서

| 문서 | 내용 |
|---|---|
| [claude.md](./claude.md) | 개발 규칙·컨벤션 (Claude Code용) |
| [architecture.md](./architecture.md) | 전체 설계: 도메인, 페이지, 개발 단계 |
| [db_schema.md](./db_schema.md) | DB 스키마: ERD, 테이블 정의, DDL |
| [api.md](./api.md) | REST API 명세 |
| [design.md](./design.md) | 디자인 시스템: 토큰, 컴포넌트, 접근성 |

## 처음 시작하기 (1회)

### 필요한 것 (전부 무료)

1. **JDK 17** — [Eclipse Temurin 17](https://adoptium.net/temurin/releases/?version=17) 설치
2. **Node.js 20+** — [nodejs.org](https://nodejs.org) LTS
3. **Docker Desktop** — 로컬 MySQL을 쓸 때만 필요 (기본 개발은 H2라 없어도 된다)
4. Gradle은 아래 wrapper 생성 후엔 필요 없음

### 백엔드 최초 셋업

Gradle Wrapper 생성이 한 번 필요하다. 방법 중 하나 선택:

- **IntelliJ IDEA Community**(무료)로 `backend/` 열기 → 자동으로 Gradle 다운로드·설정됨 (가장 쉬움)
- 또는 Gradle 수동 설치 후: `cd backend && gradle wrapper --gradle-version 8.10`

이후에는:

```bash
cd backend
./gradlew bootRun     # Windows: gradlew.bat bootRun
```

- 확인: http://localhost:8080/api/health
- H2 콘솔: http://localhost:8080/h2-console (JDBC URL: `jdbc:h2:mem:ondo`, user: `sa`)
- 관리자: 아이디 `admin`, 비밀번호는 `backend/.env`의 `ADMIN_PASSWORD` 값 (gitignored)

기본 `dev` 프로파일은 H2 인메모리라 **앱을 끄면 데이터가 사라진다.** 데이터를 유지하거나 배포 전 검증이 필요하면 아래 `local`을 쓴다.

### 로컬 MySQL (배포 전 검증용)

운영과 같은 MySQL·같은 마이그레이션으로 돌려서, 배포했을 때 터질 스키마 문제를 미리 잡는 용도다. Docker Desktop이 필요하다.

```bash
docker compose up -d
```

```bash
cd backend && ./gradlew bootRun --args='--spring.profiles.active=local'
```

- MySQL 8.4 컨테이너가 **3307** 포트로 뜬다 (PC에 이미 설치된 MySQL의 3306과 충돌 방지)
- 스키마는 Flyway(`backend/src/main/resources/db/migration`)가 만들고, JPA가 엔티티와 일치하는지 검증한다
- 데이터를 싹 지우고 다시 시작: `docker compose down -v` 후 다시 `up -d`

DB 접속:

```bash
docker compose exec mysql mysql --default-character-set=utf8mb4 -u ondo -pondo_local_pw ondo
```

### 배포 시 (참고)

운영은 관리형 MySQL(RDS, Cloud SQL 등)을 쓰고 `prod` 프로파일로 실행한다. 필요한 환경변수:

| 변수 | 설명 |
|---|---|
| `DB_URL` | `jdbc:mysql://<host>:3306/ondo?serverTimezone=Asia/Seoul&characterEncoding=UTF-8` |
| `DB_USERNAME` / `DB_PASSWORD` | DB 계정 |
| `JWT_SECRET` | 운영용 시크릿 (기본값 사용 금지) |
| `ADMIN_PASSWORD` | 관리자 계정 최초 생성용. 계정 생성 후 환경변수에서 제거 |

스키마는 첫 기동 때 Flyway가 자동 생성한다. 자세한 내용은 [db_schema.md](db_schema.md) 참조.

### 프론트엔드

```bash
cd frontend
npm install           # 최초 1회
npm run dev
```

- 확인: http://localhost:5173 (백엔드 실행 중이면 "백엔드: 연결됨" 표시)

### 관리자 화면

콘텐츠 등록·수정은 전부 여기서 한다 (DB를 직접 만질 필요 없음).

- 주소: http://localhost:5173/admin — 아이디 `admin`, 비밀번호는 `backend/.env`의 `ADMIN_PASSWORD`
- 비밀번호는 이 설정값이 곧 로그인 값이다(변경 화면 없음). 부팅 때 계정이 없으면 만들고, 있으면 이 값으로 맞춘다.
  로컬은 `backend/.env`(gitignored), 운영은 `ADMIN_PASSWORD` 환경변수로 넣는다 — 소스에 비밀번호를 커밋하지 않는다.
- 보유자·상품·뉴스·협업 실적 CRUD, 문의 처리, 주문 상태 관리, 이미지 업로드
- 공개 사이트와 라우트만 공유하고 레이아웃은 분리돼 있다 (`src/pages/admin`, `src/components/admin`)

주문 상태는 허용된 전이만 버튼으로 뜬다(예: 결제 대기 → 결제 완료/취소). 전이 규칙의 단일 출처는
`OrderStatus.allowedNextStatuses()`이고, 서버가 주문 상세 응답에 담아 내려주므로 프론트에는 규칙 사본이 없다.
규칙을 바꿀 때는 이 enum만 고치면 된다.

## 개발 현황

- [x] 설계 문서 5종
- [x] 프로젝트 셋업 (Spring Boot + Vite)
- [ ] Phase 1: 백엔드 도메인 API (Artisan → Product → News → Project → Inquiry → Order)
- [ ] Phase 2: 프론트 공개 페이지
- [ ] Phase 3: 관리자 화면 + 배포
- [ ] Phase 4: PG 실연동, 다국어
[
## 참고사이트 
(https://www.yungbld.com/)
(https://blit.studio/)
