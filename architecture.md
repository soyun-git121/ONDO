# ONDO 웹사이트 아키텍처

> 전통문화 소속사 ONDO의 공식 랜딩 페이지 + 보유자 브랜딩·상품 판매 플랫폼.
> 사업계획서(P-S-S-D, 2026.07) 기반. 백엔드 우선 개발, 결제는 화면만 구성(실결제 보류).

---

## 1. 서비스 개요

**ONDO**: 무형문화재 보유자의 브랜딩·상품기획·판매·계약을 전담하는 전통문화 소속사.
웹사이트의 역할:

| 목적 | 대상 | 핵심 페이지 |
|---|---|---|
| 브랜드 신뢰 구축 | B2C 소비자, 기업, 기관 | About, 보유자 랜딩 |
| 보유자 개인 브랜딩 | 팬덤, 컬렉터, 해외 바이어 | 보유자 상세(개별 랜딩) |
| 상품 판매 (MVP: 결제 UI만) | B2C 소비자 | Shop, 상품 상세, 주문 화면 |
| B2B/콜라보 리드 확보 | 기업·기관·지자체 | 협업문의 |
| 실적 증명(쇼케이스) | 기업·기관, 예비 소속 보유자 | Projects(업무 이력) |
| 전통문화 콘텐츠 허브 | 전체 | News |
| SNS 유입 | 전체 | 인스타그램 연결 |

## 2. 기술 스택

| 레이어 | 선택 | 비고 |
|---|---|---|
| Backend | Spring Boot 3.x (Java 17), Spring Data JPA, Spring Security | REST API |
| DB | 개발: H2 → 운영: MySQL 8 (또는 PostgreSQL) | JPA로 교체 용이 |
| Frontend | React 18 + Vite + TypeScript | UI 규칙은 design.md 준수 |
| 스타일 | Tailwind CSS | design.md 토큰으로 config 구성, raw hex 금지 |
| 이미지 저장 | 초기: 로컬/서버 디렉토리 → 확장: S3 호환 스토리지 | Artisan·Product 이미지 다수 |
| 인증 | 관리자용 JWT (Access + Refresh) | 일반 회원가입은 Phase 3 이후 |
| 결제 | **보류.** Order 도메인·주문 화면까지만. PG(토스페이먼츠) 연동부는 인터페이스로 분리 | `PaymentGateway` 인터페이스 + `MockPaymentGateway` 구현 |

### 모노레포 구조

```
ondo/
├── backend/                  # Spring Boot
│   └── src/main/java/kr/ondo/
│       ├── domain/           # 도메인별 패키지 (아래 참조)
│       ├── global/           # 공통 설정, 예외, 응답 포맷, 보안
│       └── OndoApplication.java
├── frontend/                 # React + Vite
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── api/              # axios 클라이언트, API 함수
│       └── types/
├── CLAUDE.md
└── ARCHITECTURE.md
```

백엔드 패키지는 레이어형이 아닌 **도메인형**: `domain/artisan/{controller,service,repository,entity,dto}` 식으로 구성.

## 3. 도메인 모델

### 3.1 Artisan (보유자) — 핵심 도메인

보유자 1명 = 브랜드 1개. `slug`로 개별 랜딩 페이지 URL 부여 (`/artisans/yoon-jongguk`).

```
Artisan
├── id, slug (unique)
├── name                    # 윤종국
├── title                   # 악기장 (종목)
├── designation             # 국가무형문화재 / 이수자 / 명장 (enum: HOLDER, SUCCESSOR, MASTER)
├── shortIntro              # 카드용 한 줄 소개 ("4대 가업, 북메우기")
├── story                   # 랜딩 페이지 본문 (마크다운 or 리치텍스트)
├── profileImageUrl, coverImageUrl
├── videoUrl                # 스토리 영상 (유튜브 embed)
├── snsLinks                # JSON: {instagram, youtube, ...}
├── displayOrder, isPublished
└── createdAt, updatedAt

ArtisanImage (1:N)          # 공방·작업·작품 갤러리
├── artisanId, imageUrl, caption, sortOrder
```

### 3.2 Product (상품)

```
Product
├── id, artisanId (FK)
├── name, slug
├── category                # enum: ARTWORK(작품형), GIFT(선물형), GOODS(소품형)
├── price
├── summary, description    # 상세페이지 본문
├── thumbnailUrl
├── stockQuantity
├── status                  # enum: ON_SALE, SOLD_OUT, INQUIRY_ONLY(작품 등 문의 판매), HIDDEN
├── externalUrl (nullable)  # 텀블벅·스마트스토어 등 외부 판매처 병행 시
└── createdAt, updatedAt

ProductImage (1:N)
```

`INQUIRY_ONLY`: 고가 작품은 건별 협의(사업계획서 BM)이므로 결제 대신 문의 폼으로 연결.

### 3.3 Order (주문) — 결제 보류 반영

```
Order
├── id, orderNumber
├── ordererName, phone, email, address
├── totalAmount
├── status                  # enum: PENDING(결제대기), PAID, PREPARING, SHIPPED, DELIVERED, CANCELLED
└── createdAt

OrderItem (1:N)             # productId, productName(스냅샷), price(스냅샷), quantity
```

- 지금: 주문서 작성 → `PENDING` 저장 → "입금 안내" 화면(무통장/문의 안내)까지만.
- 나중: `PaymentGateway.approve()` 구현체만 토스페이먼츠로 교체 → `PAID` 전이.
- 장바구니는 프론트 상태(localStorage 아닌 메모리/쿠키)로만, 서버 저장 안 함.

### 3.4 News (전통문화 뉴스)

```
News
├── id, title, thumbnailUrl
├── type                    # enum: ORIGINAL(자체 작성), CURATED(외부 기사 링크)
├── content (ORIGINAL일 때) / externalUrl + sourceName (CURATED일 때)
├── category                # enum: ONDO_NEWS(온도 소식), TRADITION(전통문화), ARTISAN(보유자 소식)
├── isPublished, publishedAt
```

### 3.5 Inquiry (협업문의)

```
Inquiry
├── id
├── type                    # enum: B2B_GIFT(기업 선물), COLLAB(콜라보), EXPERIENCE(체험·강연), B2G, ETC
├── companyName, contactName, email, phone
├── message
├── status                  # enum: NEW, IN_REVIEW, REPLIED, CLOSED
└── createdAt
```

BM상 B2B가 핵심 수익원이므로 문의 유형을 수익원 구조 그대로 분류 → 리드 관리 데이터로 활용.

### 3.6 Project (업무 이력·협업 실적) — 쇼케이스

완료된 프로젝트·협업 건을 자랑하는 포트폴리오. B2B 영업의 신뢰 근거이자 보유자 랜딩의 실적 섹션.

```
Project
├── id, slug
├── title                   # "OO기업 명절 선물 패키지 500세트"
├── type                    # enum: B2B_GIFT, COLLAB, EXPERIENCE, LECTURE, B2G, EXHIBITION, FUNDING, ETC
├── clientName              # 협업 기업·기관명 (비공개 시 "국내 대기업 A사")
├── summary                 # 카드용 한 줄
├── description             # 상세 본문 (마크다운: 배경 → 진행 → 결과)
├── resultMetric            # 핵심 성과 한 줄 ("펀딩률 9,800% 달성", "완판")
├── thumbnailUrl
├── projectDate             # 대표 일자 (정렬·타임라인용)
├── isFeatured              # 홈·협업문의 페이지 노출 여부
├── displayOrder, isPublished
└── createdAt, updatedAt

ProjectArtisan (N:M)        # projectId, artisanId — 한 프로젝트에 여러 보유자 참여 가능
ProjectImage (1:N)          # 진행 사진·결과물 갤러리
```

노출 위치 3곳: ① `/projects` 목록·상세, ② 보유자 랜딩의 "참여 프로젝트" 섹션, ③ 협업문의 페이지의 실적 섹션(설득 자료).

### 3.7 Admin

```
AdminUser: id, username, password(BCrypt), role
```

## 4. API 설계 (REST)

공통 응답: `{ "success": bool, "data": ..., "error": {code, message} }`, 목록은 페이지네이션(`page`, `size`).

### 공개 API

| Method | Path | 설명 |
|---|---|---|
| GET | `/api/artisans` | 보유자 목록 (카드용 요약) |
| GET | `/api/artisans/{slug}` | 보유자 상세 + 갤러리 + 대표 상품 |
| GET | `/api/products` | 상품 목록 (`?artisan=&category=&sort=`) |
| GET | `/api/products/{slug}` | 상품 상세 |
| POST | `/api/orders` | 주문 생성 (결제대기 상태로 저장) |
| GET | `/api/orders/{orderNumber}?phone=` | 비회원 주문 조회 |
| GET | `/api/news`, `/api/news/{id}` | 뉴스 목록/상세 |
| GET | `/api/projects` | 협업 실적 목록 (`?type=&artisan=`) |
| GET | `/api/projects/{slug}` | 실적 상세 + 참여 보유자 + 갤러리 |
| POST | `/api/inquiries` | 협업문의 접수 |
| GET | `/api/home` | 홈 화면용 통합 데이터(대표 보유자, 인기 상품, 최신 뉴스) |

### 관리자 API (`/api/admin/**`, JWT)

| Method | Path | 설명 |
|---|---|---|
| POST | `/api/admin/auth/login` | 로그인 |
| CRUD | `/api/admin/artisans`, `/api/admin/products`, `/api/admin/news`, `/api/admin/projects` | 콘텐츠 관리 |
| GET/PATCH | `/api/admin/inquiries` | 문의 목록·상태 변경 |
| GET/PATCH | `/api/admin/orders` | 주문 목록·상태 변경 |
| POST | `/api/admin/uploads` | 이미지 업로드 |

## 5. 프론트엔드 페이지 구조

```
/                      홈: 히어로 → ONDO 소개 요약 → 소속 보유자 → 대표 상품 → 뉴스 → 협업 배너
/about                 About: introduction(추진배경·문제의식) + identity(온도의 의미, 비전, 운영 프로세스, 차별점)
/artisans              보유자 개요: 카드 무한스크롤 그리드 (yungbld 스타일, 카드 클릭 → 개별 랜딩. design.md §3)
/artisans/:slug        보유자 개별 랜딩: 커버 → 스토리(4대 가업 등) → 영상 → 갤러리 → 이 보유자의 상품 → 협업 문의 CTA
/shop                  상품 목록: 필터(보유자·카테고리), 정렬
/shop/:slug            상품 상세: 이미지, 보유자 스토리 연결, 구매(주문서) or 문의(INQUIRY_ONLY)
/order                 주문서 작성 → 완료(입금 안내) — 실결제 없음
/news                  뉴스 목록 (탭: 온도 소식 / 전통문화 / 보유자 소식)
/news/:id              뉴스 상세 (CURATED는 외부 링크로)
/projects              업무 이력: 협업 실적 카드 그리드 (유형 필터, 타임라인 정렬)
/projects/:slug        실적 상세: 배경 → 진행 → 결과(성과 지표 강조) → 참여 보유자 → 협업문의 CTA
/collaboration         협업문의: 유형 선택 폼 + featured 실적 섹션 + 선행사례(예올×샤넬 등)로 설득력 부여
/admin/**              관리자 (로그인, 보유자/상품/뉴스/문의/주문 관리)
```

인스타그램: 헤더·푸터 아이콘 링크 + 홈 하단 피드 섹션(초기엔 링크만, 추후 embed).

**공통 레이아웃**: Header(로고, GNB, 인스타 아이콘) / Footer(사업자 정보, SNS, 협업문의 링크).
**디자인은 design.md 준수**: blit.studio 무드의 홈(대형 타이포+여백) + yungbld 스타일 카드, 라이트 팔레트(민트 primary). 모든 색·서체·여백은 design.md 토큰만 사용.

## 6. 개발 단계

### Phase 1 — 백엔드 코어 (지금)
1. 프로젝트 셋업 (Spring Boot, H2, 공통 응답/예외 처리)
2. Artisan → Product → News → Project → Inquiry 도메인 순서로 엔티티+API (파일럿: 악기장 윤종국 데이터를 시드로)
3. 관리자 인증(JWT) + 관리자 CRUD API
4. 이미지 업로드
5. Order 도메인 + MockPaymentGateway

### Phase 2 — 프론트 공개 페이지
홈 → About → 보유자 목록/상세 → Shop/상품 상세 → News → 협업문의. 주문 화면(결제 UI만).

### Phase 3 — 관리자 화면 + 운영 준비
관리자 UI, 주문·문의 관리, 배포(백: 클라우드 VM/컨테이너, 프론트: 정적 호스팅), 도메인·HTTPS.

### Phase 4 — 보류 항목 해제
PG 실연동(토스페이먼츠), 일반 회원, 인스타 피드 embed, 다국어(영문 — 구매자 80% 외국인 사례 대응), 크라우드펀딩 연계.

## 7. 설계 원칙

- **보유자 중심**: 데이터·URL·화면 모두 보유자(브랜드)가 1급 객체. 상품은 보유자에 종속.
- **결제 분리**: 주문 생성과 결제 승인을 처음부터 분리해 PG 연동 시 Order 코드 무변경.
- **확장 대비**: 보유자 추가(장도장 박종군 등)는 데이터 입력만으로 가능해야 함 — 하드코딩 금지, 전부 admin CRUD.
- **스토리 = 콘텐츠**: story·description은 마크다운으로 저장해 상세페이지·B2B 제안서 재활용 가능하게.
