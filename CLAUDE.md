# CLAUDE.md — ONDO 웹사이트

전통문화 소속사 ONDO 웹사이트. 상세 설계는 **ARCHITECTURE.md** 참조 — 도메인·API·페이지 작업 전 반드시 해당 문서의 해당 섹션을 먼저 확인할 것.

## 프로젝트 상태

- 백엔드 우선 개발 중 (Phase 1)
- **결제는 실연동 금지**: 주문 화면·Order 도메인까지만. PG 호출부는 `PaymentGateway` 인터페이스 + Mock 구현으로.
- 디자인은 **design.md** 준수: 토큰(CSS 변수)만 사용, raw hex 금지. 홈은 blit.studio 무드(대형 타이포+여백), 보유자 목록은 yungbld 스타일 카드 무한스크롤.

## 스택 & 구조

- `backend/`: Spring Boot 3.x, Java 17, Spring Data JPA, Spring Security(JWT), dev=H2 / prod=MySQL
- `frontend/`: React 18 + Vite + TypeScript + Tailwind
- 백엔드 패키지: 도메인형 — `kr.ondo.domain.{artisan|product|order|news|project|inquiry|admin}.{controller|service|repository|entity|dto}`
- 공통 코드: `kr.ondo.global` (설정, 예외, ApiResponse, 보안)

## 명령어

```bash
# backend/
./gradlew bootRun            # 실행 (dev 프로필, H2)
./gradlew test               # 테스트
./gradlew build              # 빌드

# frontend/
npm run dev                  # Vite 개발 서버 (proxy → :8080)
npm run build
npm run lint
```

## 컨벤션

### 백엔드
- 응답은 항상 `ApiResponse<T>` 래핑: `{ success, data, error: {code, message} }`
- 예외는 `GlobalExceptionHandler` + 도메인별 ErrorCode enum. 컨트롤러에서 try-catch 금지
- 엔티티에 setter 금지 — 의도가 드러나는 변경 메서드 사용 (예: `product.soldOut()`)
- DTO는 record 사용, 엔티티를 컨트롤러 밖으로 노출 금지
- 조회용 URL 식별자는 id가 아닌 `slug` (Artisan, Product)
- 상태값은 전부 enum (Product.status, Order.status, Inquiry.type 등 — ARCHITECTURE.md §3 참조)
- 목록 API는 페이지네이션 기본 적용

### 프론트
- API 호출은 `src/api/`에만, 컴포넌트에서 직접 axios 금지
- 타입은 `src/types/`에 백엔드 DTO와 1:1로 유지
- 페이지 컴포넌트는 `src/pages/`, 재사용은 `src/components/`
- **localStorage로 장바구니 저장 금지** — 메모리 상태 + 쿠키

### 공통
- 커밋 메시지: `feat|fix|refactor|docs|chore: 한글 요약` (예: `feat: 보유자 상세 API 추가`)
- 하드코딩된 보유자·상품 데이터 금지 — 시드 데이터는 `data.sql`(dev)로만

## 도메인 핵심 규칙 (요약)

- **Artisan(보유자)이 1급 객체**. 상품·콘텐츠는 보유자에 종속. 보유자 추가는 admin CRUD만으로 가능해야 함
- Product.status가 `INQUIRY_ONLY`면 구매 버튼 대신 협업문의 폼으로 연결 (고가 작품은 건별 협의)
- Order는 `PENDING`으로 생성 후 입금 안내 화면까지만 — `PAID` 전이는 PG 연동(Phase 4) 전까지 admin에서 수동 처리
- Inquiry.type은 수익원 분류와 동일하게 유지 (B2B_GIFT, COLLAB, EXPERIENCE, B2G, ETC)
- Project(협업 실적)는 Artisan과 N:M — 보유자 랜딩·협업문의 페이지에 재사용되므로 단독 조회 API와 보유자별 조회 모두 지원
- story·description 필드는 마크다운 저장

## 하지 말 것

- 실결제 PG SDK 연동 (Phase 4 전까지)
- 일반 사용자 회원가입/로그인 (관리자 JWT만)
- 보유자·상품 정보 하드코딩
- 프론트에 색상 hex 직접 사용 (design.md의 토큰 변수로)
- brand 색 위 흰색 텍스트, accent(#E0F69D 라임)를 텍스트 색으로 사용
- `outline: none`으로 포커스 링 제거
