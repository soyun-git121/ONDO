# ONDO API 명세

> Base URL: `/api` · 인증: 관리자만 JWT(Bearer) · 도메인 모델은 db_schema.md, 전체 설계는 ARCHITECTURE.md 참조.

## 공통

### 응답 포맷

```json
// 성공
{ "success": true, "data": { ... }, "error": null }

// 실패
{ "success": false, "data": null, "error": { "code": "ARTISAN_NOT_FOUND", "message": "보유자를 찾을 수 없습니다." } }
```

### 목록 응답 (페이지네이션)

쿼리: `?page=0&size=12` (0-base, size 기본 12·최대 50)

```json
{
  "success": true,
  "data": {
    "content": [ ... ],
    "page": 0, "size": 12,
    "totalElements": 34, "totalPages": 3, "hasNext": true
  }
}
```

### 에러 코드

| HTTP | code | 상황 |
|---|---|---|
| 400 | `INVALID_INPUT` | 검증 실패 (필드별 상세는 `error.fields`) |
| 401 | `UNAUTHORIZED` | 토큰 없음/만료 |
| 403 | `FORBIDDEN` | 권한 없음 |
| 404 | `{DOMAIN}_NOT_FOUND` | ARTISAN / PRODUCT / ORDER / NEWS / PROJECT / INQUIRY |
| 409 | `OUT_OF_STOCK` | 주문 시 재고 부족 |
| 409 | `DUPLICATE_SLUG` | admin 등록 시 slug 중복 |
| 500 | `INTERNAL_ERROR` | 서버 오류 |

### Enum 값

| Enum | 값 |
|---|---|
| Artisan.designation | `HOLDER` `SUCCESSOR` `MASTER` |
| Product.category | `ARTWORK` `GIFT` `GOODS` |
| Product.status | `ON_SALE` `SOLD_OUT` `INQUIRY_ONLY` `HIDDEN` |
| Order.status | `PENDING` `PAID` `PREPARING` `SHIPPED` `DELIVERED` `CANCELLED` |
| News.type / category | `ORIGINAL` `CURATED` / `ONDO_NEWS` `TRADITION` `ARTISAN` |
| Project.type | `B2B_GIFT` `COLLAB` `EXPERIENCE` `LECTURE` `B2G` `EXHIBITION` `FUNDING` `ETC` |
| Inquiry.type | `B2B_GIFT` `COLLAB` `EXPERIENCE` `B2G` `ETC` |
| Inquiry.status | `NEW` `IN_REVIEW` `REPLIED` `CLOSED` |

---

## 1. 홈

### GET `/api/home`

홈 화면용 통합 데이터 (1콜).

```json
{
  "featuredArtisans": [ { "slug": "yoon-jongguk", "name": "윤종국", "title": "악기장", "designation": "HOLDER", "shortIntro": "4대 가업, 북메우기", "profileImageUrl": "..." } ],
  "featuredProducts": [ { "slug": "mini-buk", "name": "미니어처 전통 북", "price": 45000, "thumbnailUrl": "...", "artisanName": "윤종국", "status": "ON_SALE" } ],
  "featuredProjects": [ { "slug": "tumblbug-9800", "title": "장도 텀블벅 펀딩", "type": "FUNDING", "resultMetric": "펀딩률 9,800% 달성", "thumbnailUrl": "..." } ],
  "latestNews": [ { "id": 3, "title": "...", "category": "ONDO_NEWS", "thumbnailUrl": "...", "publishedAt": "2026-07-01T09:00:00" } ]
}
```

## 2. 보유자 (Artisan)

### GET `/api/artisans`

쿼리: `page`, `size`, `designation`(선택). `isPublished=true`만 노출, `displayOrder` 정렬.

content 항목: `slug, name, title, designation, shortIntro, profileImageUrl`

### GET `/api/artisans/{slug}`

```json
{
  "slug": "yoon-jongguk",
  "name": "윤종국", "title": "악기장", "designation": "HOLDER",
  "shortIntro": "4대 가업, 북메우기",
  "story": "## 4대를 이어온 소리\n...(마크다운)",
  "coverImageUrl": "...", "profileImageUrl": "...", "videoUrl": "https://youtube.com/embed/...",
  "snsLinks": { "instagram": "https://instagram.com/..." },
  "images": [ { "imageUrl": "...", "caption": "공방 전경", "sortOrder": 0 } ],
  "products": [ { "slug": "mini-buk", "name": "...", "price": 45000, "category": "GOODS", "status": "ON_SALE", "thumbnailUrl": "..." } ],
  "projects": [ { "slug": "tumblbug-9800", "title": "...", "type": "FUNDING", "resultMetric": "...", "projectDate": "2026-03-01", "thumbnailUrl": "..." } ]
}
```

`products`는 HIDDEN 제외 최신 8개, `projects`는 공개된 것 전부(참여 보유자 기준).

## 3. 상품 (Product)

### GET `/api/products`

쿼리: `page`, `size`, `artisan`(slug), `category`, `sort`(`latest`|`priceAsc`|`priceDesc`, 기본 latest). `HIDDEN` 제외.

content 항목: `id, slug, name, price, category, status, summary, thumbnailUrl, artisanName, artisanSlug`

### GET `/api/products/{slug}`

```json
{
  "id": 1, "slug": "mini-buk", "name": "미니어처 전통 북",
  "category": "GOODS", "price": 45000, "status": "ON_SALE", "stockQuantity": 20,
  "summary": "...", "description": "...(마크다운)",
  "thumbnailUrl": "...", "externalUrl": null,
  "images": [ { "imageUrl": "...", "caption": null, "sortOrder": 0 } ],
  "artisan": { "slug": "yoon-jongguk", "name": "윤종국", "title": "악기장", "profileImageUrl": "...", "shortIntro": "..." }
}
```

프론트 분기: `status=INQUIRY_ONLY` → 구매 버튼 대신 협업문의 링크. `externalUrl` 있으면 외부 판매처 버튼 병행.

## 4. 주문 (Order) — 실결제 없음, PENDING까지

### POST `/api/orders`

```json
// 요청
{
  "ordererName": "홍길동", "phone": "010-1234-5678", "email": "a@b.com",
  "zipcode": "03187", "address": "서울시 종로구 ...", "addressDetail": "101호",
  "memo": "부재 시 문 앞",
  "items": [ { "productId": 1, "quantity": 2 } ]
}

// 응답 201
{ "orderNumber": "ONDO-20260712-A3F9K2", "totalAmount": 90000, "status": "PENDING" }
```

처리: 서버가 가격 재계산(클라이언트 금액 신뢰 안 함) → 재고 조건부 차감(부족 시 409 `OUT_OF_STOCK`) → 상품명·보유자명 스냅샷 저장 → 입금 안내 화면으로.

### GET `/api/orders/{orderNumber}?phone=010-1234-5678`

비회원 주문 조회. orderNumber + phone 둘 다 일치해야 반환 (불일치 시 404 — phone 존재 여부 노출 방지).

```json
{
  "orderNumber": "ONDO-20260712-A3F9K2", "status": "PENDING",
  "ordererName": "홍길동", "totalAmount": 90000, "createdAt": "...",
  "items": [ { "productName": "미니어처 전통 북", "artisanName": "윤종국", "price": 45000, "quantity": 2 } ]
}
```

## 5. 뉴스 (News)

### GET `/api/news`

쿼리: `page`, `size`, `category`. 공개분만, `publishedAt DESC`.

content 항목: `id, title, type, category, thumbnailUrl, sourceName, externalUrl, publishedAt` — `type=CURATED`면 프론트에서 externalUrl 새 탭 이동, 상세 페이지 없음.

### GET `/api/news/{id}`

`ORIGINAL` 전용: `id, title, category, content(마크다운), thumbnailUrl, publishedAt, artisan{slug,name}|null`

## 6. 협업 실적 (Project)

### GET `/api/projects`

쿼리: `page`, `size`, `type`, `artisan`(slug), `featured`(bool). 공개분만, `projectDate DESC`.

content 항목: `slug, title, type, clientName, summary, resultMetric, thumbnailUrl, projectDate, artisans:[{slug,name}]`

### GET `/api/projects/{slug}`

```json
{
  "slug": "tumblbug-9800", "title": "장도 텀블벅 크라우드펀딩",
  "type": "FUNDING", "clientName": "텀블벅",
  "summary": "...", "description": "...(마크다운: 배경→진행→결과)",
  "resultMetric": "펀딩률 9,800% 달성", "projectDate": "2026-03-01",
  "thumbnailUrl": "...",
  "images": [ { "imageUrl": "...", "caption": "...", "sortOrder": 0 } ],
  "artisans": [ { "slug": "park-jonggun", "name": "박종군", "title": "장도장", "role": "장도 제작", "profileImageUrl": "..." } ]
}
```

## 7. 협업문의 (Inquiry)

### POST `/api/inquiries`

```json
// 요청
{
  "type": "B2B_GIFT",
  "companyName": "주식회사 온기", "contactName": "김담당", 
  "email": "kim@ongi.co.kr", "phone": "02-123-4567",
  "message": "명절 선물 패키지 300세트 문의드립니다."
}

// 응답 201
{ "id": 17, "status": "NEW" }
```

스팸 방지: 동일 IP 1분 3회 제한(rate limit), honeypot 필드 검증.

---

## 8. 관리자 API (`/api/admin/**`)

인증 헤더: `Authorization: Bearer {accessToken}` — 없거나 만료 시 401.

### POST `/api/admin/auth/login`

```json
// 요청
{ "username": "admin", "password": "..." }
// 응답
{ "accessToken": "eyJ...", "expiresIn": 1800 }
```

Refresh 토큰은 HttpOnly 쿠키. `POST /api/admin/auth/refresh`, `POST /api/admin/auth/logout`.

### 콘텐츠 CRUD (공통 패턴)

| 리소스 | 경로 | 비고 |
|---|---|---|
| 보유자 | `/api/admin/artisans` | GET(목록·비공개 포함)/POST, `/{id}` GET/PUT/DELETE, 이미지는 `/{id}/images` POST·DELETE·순서변경 |
| 상품 | `/api/admin/products` | 동일 패턴 + `PATCH /{id}/status` (품절 등 상태만 변경) |
| 뉴스 | `/api/admin/news` | 동일 패턴 + `PATCH /{id}/publish` |
| 실적 | `/api/admin/projects` | 동일 패턴, 요청에 `artisans: [{artisanId, role}]` 배열 포함 |

POST/PUT 요청 본문은 공개 API 응답 구조와 동일 필드(서버 생성 필드 제외). slug 중복 시 409.

### GET/PATCH `/api/admin/inquiries`

- GET: `?status=&type=&page=` → 목록 (message 전문, adminNote 포함)
- `PATCH /{id}`: `{ "status": "IN_REVIEW", "adminNote": "7/15 미팅 예정" }`

### GET/PATCH `/api/admin/orders`

- GET: `?status=&page=` → 목록 (주문자·금액·상태)
- `PATCH /{id}/status`: `{ "status": "PAID" }` — 입금 수동 확인용. 전이 규칙: PENDING→PAID→PREPARING→SHIPPED→DELIVERED, 취소는 PENDING·PAID에서만. 규칙 위반 시 400
- 취소 시 재고 복원

### POST `/api/admin/uploads`

`multipart/form-data`, 필드명 `file`. jpg/png/webp, 최대 10MB.

```json
{ "url": "/uploads/2026/07/a3f9k2.webp" }
```

---

## 구현 순서 (Phase 1 기준)

1. 공통(ApiResponse, 예외 핸들러, 페이지네이션) → 2. Artisan 공개 API → 3. admin 인증 + Artisan CRUD → 4. Product → 5. uploads → 6. News → 7. Project → 8. Inquiry → 9. Order + Mock 결제

각 단계마다 통합 테스트(`@SpringBootTest` + RestAssured 또는 MockMvc) 작성 후 다음 단계로.
