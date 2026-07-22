import type { ReactNode } from "react";

/**
 * Shop — Figma 46:2 "Shop / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout). 본문 = 대형 헤딩 + Featured 배너 +
 * 툴바 + 필터 사이드바 + 9-카드 상품 그리드(3×3).
 * 타이포 Inter(한글 Pretendard 폴백), 색은 토큰/피그마 값 1:1(#f2f2f2·#e5e5e5·#666·#999).
 *
 * ≥1280: Figma 1440 콘텐츠존을 max-w-[1280px] 캔버스에 절대좌표로 재현.
 *        좌표 = (figmaX-80, figmaY-120). <1280: 세로 스택 반응형.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

/** 상품 카드 열 left / 행 image-top (캔버스 좌표) */
const COLS = [306.2, 641.2, 976.2];
const ROWS = [666.89, 1166.89, 1666.89];

type Line3Kind = "price" | "muted" | "inquiry";
const LINE3: Record<Line3Kind, string> = {
  price: "text-[14px] font-bold text-text-primary",
  muted: "text-[14px] font-bold text-[#999]",
  inquiry: "text-[13px] font-medium leading-[1.6] text-text-primary",
};

interface Product {
  badge?: string;
  badgeMuted?: boolean;
  brand: string;
  title: string;
  line3: string;
  line3kind: Line3Kind;
  cta?: string;
}

const PRODUCTS: Product[] = [
  { badge: "신상", brand: "윤종국 · 악기장", title: "미니어처 전통 북", line3: "45,000원", line3kind: "price", cta: "주문하기" },
  { brand: "윤종국 · 악기장", title: "[상품 준비 중]", line3: "—", line3kind: "muted" },
  { brand: "박종군 · 장도장", title: "장도 문진", line3: "주문 문의", line3kind: "inquiry" },
  { brand: "박종군 · 장도장", title: "[상품 준비 중]", line3: "—", line3kind: "muted" },
  { badge: "품절", badgeMuted: true, brand: "[보유자]", title: "[상품 준비 중]", line3: "—", line3kind: "muted" },
  { brand: "[보유자]", title: "[상품 준비 중]", line3: "—", line3kind: "muted" },
  { brand: "[보유자]", title: "[상품 준비 중]", line3: "—", line3kind: "muted" },
  { brand: "[보유자]", title: "[상품 준비 중]", line3: "—", line3kind: "muted" },
  { brand: "[보유자]", title: "[상품 준비 중]", line3: "—", line3kind: "muted" },
];

const FILTERS = [
  { label: "전체", count: "30", active: true },
  { label: "윤종국 · 악기장", count: "12" },
  { label: "박종군 · 장도장", count: "08" },
  { label: "[보유자 03]", count: "준비 중" },
  { label: "[보유자 04]", count: "준비 중" },
];

/** 절대 배치 텍스트 헬퍼 */
function A({
  l,
  t,
  w,
  cls = "",
  children,
}: {
  l: number;
  t: number;
  w?: number;
  cls?: string;
  children: ReactNode;
}) {
  return (
    <p className={`absolute ${cls}`} style={{ left: l, top: t, width: w }}>
      {children}
    </p>
  );
}

export default function Shop() {
  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <div className="relative mx-auto h-[2240px] max-w-[1280px]">
          {/* 헤딩 — 46:7 : Inter Bold 150px */}
          <h1
            className="absolute whitespace-nowrap text-[150px] font-bold leading-none text-text-primary"
            style={{ left: 18, top: 0 }}
          >
            Shop
          </h1>

          {/* ── Featured / banner (244:392) ── */}
          <div className="absolute bg-surface-muted" style={{ left: 306.2, top: 336.89, width: 980, height: 240 }} />
          <A l={1217} t={302} cls="whitespace-nowrap text-[12px] font-medium text-text-primary">주문문의</A>
          <A l={759.7} t={388.89} cls="whitespace-nowrap text-[14px] font-medium text-text-muted">FEATURED</A>
          <A l={613.2} t={412.89} cls="whitespace-nowrap text-[40px] font-bold text-text-primary">보유자의 손끝, 온도</A>
          <A l={573.7} t={478.89} cls="whitespace-nowrap text-[15px] leading-[1.6] text-text-muted">
            이 계절 온도가 추천하는 보유자의 작품 — 이미지·큐레이션 준비 중
          </A>

          {/* ── Toolbar (244:393) ── */}
          <A l={306.2} t={604.89} cls="whitespace-pre text-[14px] text-text-primary">{"▦  ☰   사이드바"}</A>
          <A l={486.2} t={604.89} cls="whitespace-pre text-[14px] text-text-primary">{"정렬: 최신순  ▾"}</A>
          <A l={1126.2} t={606.89} w={160} cls="text-right text-[13px] text-text-muted">전체 30점 중 1–12</A>
          <div className="absolute bg-border-base" style={{ left: 306.2, top: 642.89, width: 980, height: 1 }} />

          {/* ── Filter / sidebar (244:391) ── */}
          <A l={-17} t={577} cls="whitespace-nowrap text-[15px] font-bold text-text-primary">보유자</A>
          <div className="absolute bg-text-primary" style={{ left: -17, top: 605, width: 26, height: 3 }} />
          <A l={-17} t={617} cls="whitespace-nowrap text-[12px] text-[#999]">장인별 필터</A>
          {FILTERS.map((f, i) => {
            const t = 657 + i * 36;
            return (
              <span key={f.label}>
                <A
                  l={-17}
                  t={t}
                  cls={`whitespace-nowrap text-[14px] ${f.active ? "font-medium text-text-primary" : "text-text-muted"}`}
                >
                  {f.label}
                </A>
                <A l={203} t={t + 2} w={50} cls="text-right text-[12px] text-[#999]">
                  {f.count}
                </A>
              </span>
            );
          })}

          {/* ── Product grid (244:390) — 3×3 ── */}
          {PRODUCTS.map((p, i) => {
            const x = COLS[i % 3];
            const y = ROWS[Math.floor(i / 3)];
            return (
              <span key={i}>
                <div className="absolute bg-surface-muted" style={{ left: x, top: y, width: 310, height: 310 }} />
                {p.badge && (
                  <A
                    l={x + 271}
                    t={y + 16}
                    cls={`whitespace-nowrap text-[12px] font-medium ${p.badgeMuted ? "text-[#999]" : "text-text-primary"}`}
                  >
                    {p.badge}
                  </A>
                )}
                <A l={x} t={y + 328} w={310} cls="text-center text-[12px] text-[#999]">{p.brand}</A>
                <A l={x} t={y + 348} w={310} cls="text-center text-[15px] font-medium text-text-primary">{p.title}</A>
                <A l={x} t={y + 374} w={310} cls={`text-center ${LINE3[p.line3kind]}`}>{p.line3}</A>
                {p.cta && <A l={x} t={y + 402} w={310} cls="text-center text-[12px] text-text-muted">{p.cta}</A>}
              </span>
            );
          })}
        </div>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6">
          <h1 className="whitespace-nowrap text-[clamp(56px,15vw,150px)] font-bold leading-none text-text-primary">
            Shop
          </h1>

          {/* Featured 배너 */}
          <div className="mt-8 bg-surface-muted px-6 py-10 text-center">
            <p className="text-[14px] font-medium text-text-muted">FEATURED</p>
            <p className="mt-2 text-[clamp(24px,7vw,40px)] font-bold text-text-primary">보유자의 손끝, 온도</p>
            <p className="mt-3 text-[15px] leading-[1.6] text-text-muted">
              이 계절 온도가 추천하는 보유자의 작품 — 이미지·큐레이션 준비 중
            </p>
          </div>

          {/* 필터 */}
          <div className="mt-8">
            <p className="text-[15px] font-bold text-text-primary">보유자</p>
            <div className="mt-1 h-[3px] w-[26px] bg-text-primary" />
            <p className="mt-2 text-[12px] text-[#999]">장인별 필터</p>
            <ul className="mt-4 flex flex-col gap-2">
              {FILTERS.map((f) => (
                <li key={f.label} className="flex items-center justify-between">
                  <span className={`text-[14px] ${f.active ? "font-medium text-text-primary" : "text-text-muted"}`}>
                    {f.label}
                  </span>
                  <span className="text-[12px] text-[#999]">{f.count}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 툴바 */}
          <div className="mt-8 flex items-center justify-between border-b border-border-base pb-3">
            <div className="flex gap-4 text-[14px] text-text-primary">
              <span className="whitespace-pre">{"▦  ☰   사이드바"}</span>
              <span className="whitespace-pre">{"정렬: 최신순  ▾"}</span>
            </div>
            <span className="whitespace-nowrap text-[13px] text-text-muted">전체 30점 중 1–12</span>
          </div>

          {/* 상품 그리드 */}
          <div className="mt-6 grid grid-cols-2 gap-x-[25px] gap-y-8 sm:grid-cols-3">
            {PRODUCTS.map((p, i) => (
              <div key={i}>
                <div className="relative aspect-square w-full bg-surface-muted">
                  {p.badge && (
                    <span
                      className={`absolute right-2 top-2 text-[12px] font-medium ${p.badgeMuted ? "text-[#999]" : "text-text-primary"}`}
                    >
                      {p.badge}
                    </span>
                  )}
                </div>
                <p className="mt-4 text-center text-[12px] text-[#999]">{p.brand}</p>
                <p className="mt-1 text-center text-[15px] font-medium text-text-primary">{p.title}</p>
                <p className={`mt-1.5 text-center ${LINE3[p.line3kind]}`}>{p.line3}</p>
                {p.cta && <p className="mt-1.5 text-center text-[12px] text-text-muted">{p.cta}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
