# ONDO Design System

## Mission

Create implementation-ready, token-driven UI guidance for the ONDO website — a traditional-culture agency landing site — optimized for consistency, accessibility (WCAG 2.2 AA), and fast delivery.

## Brand

- Product/brand: ONDO (온도) — 전통문화 소속사
- Audience: B2C 소비자, B2B 기업·기관 담당자, 보유자·이수자
- Product surface: marketing/landing site + commerce(주문 UI) + admin
- Design references:
  - **blit.studio** → 메인(홈) 무드: 큰 디스플레이 타이포그래피, 넉넉한 여백, 이미지·영상과 텍스트가 교차하는 에디토리얼 레이아웃, 미니멀 내비게이션
  - **yungbld.com** → 보유자 목록: 라운드 카드 + 무한스크롤 피드, 카드 클릭 시 상세로 이동
- 차이점: 레퍼런스는 다크 배경이지만 ONDO는 **라이트 팔레트**. 무드는 타이포·여백·레이아웃으로 가져오고 색은 아래 토큰을 따른다.

## Design Tokens

모든 값은 CSS 변수로 정의하고 컴포넌트에서 raw hex 사용을 금지한다. Tailwind 설정(`tailwind.config`)은 이 토큰을 참조해서만 구성한다.

### Color

```css
:root {
  /* neutrals */
  --color-bg-base:        #FAFAFA;  /* 페이지 배경 */
  --color-surface-base:   #FFFFFF;  /* 카드·패널 */
  --color-surface-muted:  #F2F2F2;  /* 섹션 구분·입력 배경·skeleton */
  --color-text-primary:   #000000;
  --color-text-muted:     #666666;
  --color-border-base:    #E5E5E5;

  /* brand — 05-wireframe-home 기준: 라임(#E0F69D) 단일 브랜드색 */
  --color-brand-primary:   #E0F69D; /* 라임 — 주요 CTA 배경, 강조 블록, 하단 협업 배너 */
  --color-brand-secondary: #E6E090; /* 옐로 — 보조 강조(resultMetric·태그). 라임과 근친 톤 */
  --color-brand-accent:    #E0F69D; /* 라임 — 아이브로우 도트·마커·hover·전통 문양. primary와 동일값(장식 통일) */

  /* semantic */
  --color-text-on-primary: #000000; /* primary 위 텍스트는 반드시 검정 */
  --color-focus-ring:      #000000;
  --color-error:           #D14343;
  --color-success:         #1F7A5C;
}
```

**Contrast rules (testable)**

- `--color-text-primary` on `bg-base`/`surface-base`: 대비 ≥ 20:1 — pass.
- `--color-text-muted(#666)` on `bg-base(#FAFAFA)`: 약 5.5:1 — AA pass. **본문 이하 크기의 텍스트에 #666보다 밝은 회색 사용 금지.**
- brand 색(라임·옐로)은 모두 밝음 → **위에 올라가는 텍스트·아이콘은 반드시 `#000`** (`#E0F69D`+`#000` ≈ 17:1 pass). 흰 텍스트 금지.
- `--color-brand-accent(#E0F69D)`는 **텍스트 색으로 사용 금지** — 밑줄·마커·hover 배경·전통 문양 등 장식 전용(밝아서 흰 배경 위 텍스트 대비 부족).

### Typography

한글 본문은 Pretendard, 라틴 디스플레이(로고·영문 헤드라인·숫자)는 Archivo — blit이 쓰는 네오 그로테스크 계열에 가장 근접한 무료 조합(국문 = Pretendard Bold, 라틴 = Archivo Bold). 디스플레이·헤드라인은 자간 -0.02em으로 blit의 타이트한 세팅을 따른다.

```css
--font-family-sans:    "Pretendard Variable", Pretendard, -apple-system, sans-serif;
--font-family-display: "Archivo", "Pretendard Variable", Helvetica, sans-serif;

--font-size-xs:   0.8125rem;  /* 13px  캡션·메타 */
--font-size-sm:   0.9375rem;  /* 15px  보조 본문 */
--font-size-base: 1.0625rem;  /* 17px  본문 */
--font-size-md:   1.25rem;    /* 20px  리드 문단 */
--font-size-lg:   1.5rem;     /* 24px  카드 제목·h3 */
--font-size-xl:   2rem;       /* 32px  섹션 제목·h2 */
--font-size-2xl:  3rem;       /* 48px  페이지 제목·h1 */
--font-size-display: clamp(3rem, 8vw, 6.5rem);  /* 홈 히어로 전용 */

--font-weight-regular: 400;
--font-weight-medium:  500;
--font-weight-bold:    700;

--line-height-tight: 1.15;  /* display·h1·h2 */
--line-height-base:  1.6;   /* 본문 */
```

Rules: 히어로·섹션 헤드라인은 `display/2xl + tight`, 자간 `-0.02em`. 본문은 `base/1.6`. **이 스케일 외 임의 폰트 크기 금지.**

### Spacing

4px 기반. 레퍼런스의 대형 여백(blit의 96~192px 섹션 갭)을 상위 스텝으로 흡수.

```css
--space-1: 4px;   --space-2: 8px;   --space-3: 16px;  --space-4: 24px;
--space-5: 32px;  --space-6: 48px;  --space-7: 64px;  --space-8: 96px;
--space-9: 160px; /* 홈 섹션 간 간격 */
```

Rules: 섹션 수직 간격은 `space-8`(모바일 `space-7`), 홈은 `space-9`(모바일 `space-8`). 카드 내부 패딩 `space-4`. **토큰 외 일회성 여백 금지.**

### Radius · Shadow · Motion

```css
--radius-sm:   8px;    /* 입력·버튼(사각형 변형) */
--radius-md:   16px;   /* 카드 — yungbld 기준 */
--radius-pill: 999px;  /* CTA 버튼·태그 */

--shadow-1: rgba(0,0,0,0.06) 0 1px 4px;            /* 카드 기본 */
--shadow-2: rgba(0,0,0,0.12) 0 4px 16px;           /* 카드 hover·모달 */

--motion-fast: 200ms;      /* hover·focus 전환 */
--motion-base: 400ms;      /* 카드 등장·페이드 */
--motion-ease: cubic-bezier(0.22, 1, 0.36, 1);
```

`prefers-reduced-motion: reduce`일 때 모든 transition/animation은 0ms 처리해야 한다(스크롤 연출 포함).

## Layout Foundations

- 컨테이너: max-width `1280px`, 좌우 패딩 `space-5`(모바일 `space-3`).
- 그리드: 12컬럼. 카드 그리드는 데스크톱 3열 / 태블릿 2열 / 모바일 1열, gap `space-4`.
- 홈은 컨테이너를 의도적으로 벗어나는 풀블리드 이미지 섹션 허용 — 단 텍스트는 컨테이너 정렬 유지.
- 브레이크포인트: `sm 640` / `md 768` / `lg 1024` / `xl 1280`.

## Components

모든 인터랙티브 컴포넌트는 default / hover / focus-visible / active / disabled / loading / error 상태를 구현해야 한다. focus-visible은 공통으로 `outline: 2px solid var(--color-focus-ring); outline-offset: 2px` — **outline 제거 금지.**

### 1. Header (GNB)

- 구조: 좌측 로고(logo.svg) · 우측 메뉴(About / 보유자 / Shop / Project / News) · CTA "협업문의"(blit 'let's talk' 방식: accent 도트 + 텍스트 링크. 도트는 장식 — aria-hidden).
- 모바일 오버레이에서는 CTA를 pill(brand-primary 배경 + 검정 텍스트)로 유지.
- sticky top, 배경 `bg-base` 95% + blur, 하단 `border-base` 1px.
- 모바일(<lg): 햄버거 → 전체 화면 오버레이 메뉴(display 타이포로 세로 나열 — blit 방식). 오버레이는 `Esc`로 닫히고 열릴 때 첫 링크로 포커스 이동, 포커스 트랩 필수.
- 현재 페이지 링크는 `aria-current="page"` + 밑줄.

### 2. Hero (홈) — blit.studio 홈 구조를 그대로 따른다

**비대칭 에디토리얼 캔버스** (데스크톱 lg+):

- **대형 로고**: 좌측 상단, logo.svg를 blit의 "blit." 자리·크기로 (높이 약 120~160px). 헤더의 소형 로고와 별개.
- **흩어진 소문구 2개**(`--font-size-md`): 서로 다른 그리드 앵커에 배치 — "전통의 온도를 잇습니다" / "소비되는 전통을 만듭니다".
- **빈 미디어 슬롯 3개**: 크기가 서로 다른 사각형(세로형 1 · 검정 정사각 1 · 가로형 1)을 엇갈리게 배치. **이미지 확보 전까지 네모 빈칸으로 유지**, 검정 사각형은 장식(aria-hidden).
- **디스플레이 문구**: 우측 하단에 `--font-size-display` 3줄 — "보유자는 창작에 / 집중하고, 온도는 / 시장과 연결합니다". 이것이 페이지 h1.
- 시각적으로 흩어져 있어도 읽기 순서(DOM 순서)는 로고 → 소문구 → 문구 순으로 명확해야 한다.
- 모바일(<lg): 세로 스택 1열로 변환(소문구 → 미디어 1개 → 디스플레이 문구), 흩어짐 배치 해제.
- 키워드 강조는 `brand-accent` 마커 — 텍스트 자체 색은 검정 유지. **이미지 위 맨 텍스트 금지.**
- 미디어 슬롯의 미세 패럴랙스 허용(이동량 `--space-3` 이하) — `prefers-reduced-motion` 시 0ms.
- **전통 문양(원형 그리드 마크)**: `tradition_mark_*.svg`(라임 `brand-accent` 톤)를 콘텐츠 뒤 장식층으로 흩어 배치 — 05-wireframe-home 기준으로 히어로·Project·News·하단 배너 부근에 반복 등장. 반드시 `aria-hidden` + `pointer-events-none` + 콘텐츠보다 낮은 z-index. 텍스트 가독성을 해치지 않는 위치·크기로만(근사 배치 허용). 홈의 브랜드 시그니처 그래픽.

### 3. ArtisanCard + 무한스크롤 그리드 (보유자 목록) — yungbld 스타일

**Anatomy**: 카드(radius-md, surface-base, shadow-1) → 커버 이미지(4:5, 상단 radius 상속) → 텍스트 영역(space-4 패딩): 종목 태그(pill, surface-muted, text-xs) / 이름(text-lg bold) / shortIntro(text-sm, text-muted, 1줄 말줄임).

**States**

| 상태 | 스펙 |
|---|---|
| default | shadow-1 |
| hover | shadow-2, 이미지 scale(1.03) `motion-fast`, 커서 pointer |
| focus-visible | 공통 포커스 링 (카드 전체가 하나의 `<a>`) |
| active | scale(0.98) |
| loading | skeleton 카드(surface-muted 펄스) 6개 |
| empty | "준비 중인 보유자가 있습니다" + 인스타그램 링크 |
| error | 재시도 버튼 포함 인라인 에러 |

**무한스크롤 동작 (must)**

- `IntersectionObserver`로 목록 하단 sentinel 감지 → `GET /api/artisans?page=n` 호출, 응답 `hasNext=false`면 observer 해제.
- 로드 중 중복 요청 방지(in-flight 가드). 다음 페이지는 skeleton 카드로 자리 표시.
- **접근성 폴백**: sentinel과 별개로 "더 보기" 버튼을 DOM에 항상 제공(시각적으로는 스크롤이 먼저 동작). 키보드 사용자는 버튼으로 로드 가능해야 한다.
- 새 카드 로드 시 `aria-live="polite"`로 "보유자 N명 추가됨" 안내.
- 상세 진입 후 뒤로가기 시 스크롤 위치·로드된 페이지 복원(세션 내 상태 유지 — react-query 캐시 등. localStorage 금지).
- 카드 전체가 링크: 클릭/Enter → `/artisans/{slug}`.

ProductCard, ProjectCard는 동일 카드 규격을 상속한다. 차이: ProductCard는 가격(text-base bold)과 상태 배지(품절: surface-muted / INQUIRY_ONLY: "주문 문의" 태그), ProjectCard는 `resultMetric`을 brand-secondary 하이라이트로 강조.

**Project 아이브로우 (홈 협업실적 섹션)** — blit의 "● Project" 라벨 방식:

- 구성: accent 도트(8px 원, `brand-accent`, 장식 — aria-hidden) + 라벨 텍스트 "Project"(text-base). 라벨명은 GNB의 "Project" 메뉴와 동일하게 유지.
- 홈의 협업실적 섹션 헤딩으로 사용하고, 콘텐츠는 빈 미디어 + 제목 + 유형·성과 메타 순.
- 도트는 색으로만 의미를 전달하지 않는 장식이므로 접근성 이슈 없음 — 단 라벨 텍스트는 반드시 함께 노출.

### 4. Button

| Variant | 스펙 |
|---|---|
| primary | brand-primary 배경, 검정 텍스트, pill, 패딩 `space-3 space-5` |
| secondary | 투명 배경, 1px border-base → hover 시 검정 border |
| ghost | 텍스트 + 밑줄 hover |

- hover: primary는 밝기 -6% (`filter: brightness(0.94)`), `motion-fast`.
- disabled: 배경 surface-muted, 텍스트 text-muted, `cursor: not-allowed`, `aria-disabled`.
- loading: 스피너 + 라벨 유지(라벨 교체 금지), `aria-busy="true"`, 클릭 무시.
- 터치 타깃 최소 44×44px.
- 라벨은 동사로: "협업 문의하기", "주문하기" — "확인", "클릭" 같은 모호 라벨 금지.

### 5. Form (협업문의 · 주문서)

- 입력: surface-base 배경, border-base 1px, radius-sm, 패딩 `space-3`. focus 시 검정 border + 포커스 링.
- 라벨은 항상 노출(`<label for>`), placeholder를 라벨 대용 금지.
- error: `--color-error` border + 하단 에러 메시지(text-xs) + `aria-describedby` 연결. 제출 실패 시 첫 에러 필드로 포커스 이동.
- 필수 표기는 라벨에 텍스트로("(필수)"), 색상만으로 구분 금지.
- 제출 버튼은 primary, 제출 중 loading 상태.

### 6. Footer

- 상단: display 타이포 한 줄 ("전통의 온도를 잇습니다") — blit 푸터 방식.
- 정보: 사업자 정보(text-xs, text-muted) / 내비 링크 / SNS 아이콘(인스타그램 우선, 아이콘+`aria-label="ONDO 인스타그램"`, 새 탭 `rel="noopener"`).
- 배경 surface-muted, 상단 border.

## Accessibility Acceptance Criteria (testable)

1. 모든 페이지 키보드만으로 탐색·조작 가능 — Tab 순서가 시각 순서와 일치 (pass/fail: 수동 탭 테스트).
2. 모든 인터랙티브 요소에 focus-visible 링 표시 (pass/fail: 탭 순회 스크린샷).
3. 텍스트 대비 AA: 본문 4.5:1↑, 24px+ 볼드 3:1↑ (pass/fail: axe/Lighthouse 대비 검사 0 violation).
4. 무한스크롤: 마우스 없이 "더 보기" 버튼으로 전체 목록 도달 가능 + 새 항목 스크린리더 안내 (pass/fail: NVDA/VoiceOver 확인).
5. 이미지 alt 필수 — 보유자 이미지는 "{이름} {종목} 작업 모습" 형식, 장식 이미지는 `alt=""` (pass/fail: axe img-alt 0 violation).
6. `prefers-reduced-motion` 시 애니메이션 비활성 (pass/fail: 에뮬레이션 토글 확인).
7. 모달·오버레이 메뉴: 포커스 트랩 + Esc 닫기 + 닫힘 후 트리거로 포커스 복귀 (pass/fail: 수동 테스트).

## Content & Tone

- 한국어 기본, 간결·확신형. 보유자 존칭 유지("윤종국 악기장").
- 헤드라인은 짧은 선언형: "소비되는 전통을 만듭니다".
- CTA는 행동+대상: "보유자 만나보기", "협업 문의하기".
- 금지: "여기를 클릭", "더보기 >>" 류 비서술 라벨.

## Anti-patterns (금지)

- raw hex를 컴포넌트 코드에 직접 사용 (토큰 변수만 허용).
- brand 색 위 흰색 텍스트, accent(#E0F69D)를 텍스트 색으로 사용.
- 토큰 외 폰트 크기·여백의 일회성 사용.
- `outline: none`으로 포커스 제거.
- 무한스크롤에서 푸터 도달 불가 상태 방치 (→ "더 보기" 버튼 + hasNext 종료로 해결).
- 스크롤 하이재킹(휠 가로채기), 3초 이상 로딩 스플래시.
- 카드 내부에 링크 중첩(카드=단일 링크 원칙 위반).

## QA Checklist

- [ ] 토큰 파일(`tokens.css`) 외 hex 사용 0건 (grep 검사)
- [ ] 컴포넌트별 7개 상태(default~error) 구현 확인
- [ ] axe 자동 검사 0 violations (전 페이지)
- [ ] 키보드 온리 시나리오: 홈 → 보유자 목록(더 보기) → 상세 → 협업문의 제출까지 완주
- [ ] 무한스크롤: hasNext 종료·중복 요청 방지·뒤로가기 복원 동작
- [ ] 모바일(360px)·태블릿·데스크톱 레이아웃 확인
- [ ] reduced-motion, 200% 줌에서 레이아웃 깨짐 없음
- [ ] 이미지 lazy loading + 4:5 비율 고정(CLS 방지, `aspect-ratio` 사용)
