# ONDO — 전통문화 소속사 웹사이트

무형문화재 보유자의 브랜딩·상품·협업을 시장과 연결하는 ONDO의 공식 웹사이트.

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
3. Gradle은 아래 wrapper 생성 후엔 필요 없음

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

### 프론트엔드

```bash
cd frontend
npm install           # 최초 1회
npm run dev
```

- 확인: http://localhost:5173 (백엔드 실행 중이면 "백엔드: 연결됨" 표시)

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
