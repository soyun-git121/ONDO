import type { ReactNode } from "react";

/**
 * News · List — Figma 53:2 "News · List / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout).
 * 구성: 대형 헤딩 + 서브타이틀 + 필터칩4 + 뉴스 카드 그리드(3×2) + 더보기 버튼.
 * 타이포 Inter(한글 Pretendard 폴백), 색은 토큰/피그마 값 1:1.
 *
 * ≥1280: Figma 1440 콘텐츠존을 max-w-[1280px] 캔버스에 절대좌표로 재현. 좌표=(figmaX-80, figmaY-120).
 * <1280: 세로 스택 반응형.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

const CHIPS = [
  { label: "전체", w: 65, active: true },
  { label: "온도 소식", w: 97 },
  { label: "전통문화", w: 93 },
  { label: "보유자 소식", w: 111 },
];
const CHIP_LEFT = [0, 75, 182, 285];

const COLS = [0, 440, 880];
const ROWS = [338.48, 768.48];

interface NewsCardData {
  cat: string;
  catW: number;
  title: string;
  meta: string;
  ext?: boolean;
}
const CARDS: NewsCardData[] = [
  { cat: "온도 소식", catW: 68, title: "[뉴스 제목]", meta: "2026. 7. 1." },
  { cat: "전통문화", catW: 65, title: "[뉴스 제목]", meta: "연합뉴스 · 2026. 6. 20.  ·  새 탭 이동", ext: true },
  { cat: "보유자 소식", catW: 79, title: "[뉴스 제목]", meta: "2026. 6. 10." },
  { cat: "온도 소식", catW: 68, title: "[준비 중]", meta: "—" },
  { cat: "전통문화", catW: 65, title: "[준비 중]", meta: "—  ·  새 탭 이동", ext: true },
  { cat: "보유자 소식", catW: 79, title: "[준비 중]", meta: "—" },
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

export default function News() {
  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <div className="relative mx-auto h-[1260px] max-w-[1280px]">
          {/* Page header */}
          <A l={0} t={0} cls="whitespace-nowrap text-[150px] font-bold leading-none text-text-primary">News</A>
          <A l={5} t={182} cls="whitespace-nowrap text-[20px] text-text-muted">온도와 전통문화의 소식을 전합니다.</A>

          {/* Filter tabs (247:382) */}
          {CHIPS.map((c, i) => (
            <div
              key={c.label}
              className={`absolute flex h-[44px] items-center justify-center rounded-[22px] border ${
                c.active ? "border-text-primary bg-text-primary text-[#fefefe]" : "border-border-base text-text-primary"
              } text-[14px] font-medium`}
              style={{ left: CHIP_LEFT[i], top: 250, width: c.w }}
            >
              {c.label}
            </div>
          ))}

          {/* News grid (247:389) — 3×2 */}
          {CARDS.map((c, i) => {
            const x = COLS[i % 3];
            const y = ROWS[Math.floor(i / 3)];
            return (
              <span key={i}>
                <div className="absolute rounded-[4px] bg-surface-muted" style={{ left: x, top: y, width: 400, height: 260 }} />
                {c.ext && (
                  <A l={x + 300} t={y + 16} w={84} cls="text-right text-[12px] font-medium text-text-primary">
                    외부 링크 ↗
                  </A>
                )}
                <div
                  className="absolute flex h-[24px] items-center justify-center rounded-[12px] border border-border-base bg-[#fefefe] text-[12px] text-text-primary"
                  style={{ left: x, top: y + 276, width: c.catW }}
                >
                  {c.cat}
                </div>
                <A l={x} t={y + 312} cls="whitespace-nowrap text-[18px] font-medium text-text-primary">{c.title}</A>
                <A l={x} t={y + 342} cls="whitespace-pre text-[13px] text-[#999]">{c.meta}</A>
              </span>
            );
          })}

          {/* Load more (247:390) */}
          <div
            className="absolute flex h-[52px] items-center justify-center rounded-[26px] border border-border-base bg-[#fefefe] text-[15px] font-medium text-text-primary"
            style={{ left: 540, top: 1158, width: 200 }}
          >
            다음 소식 보기
          </div>
        </div>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6">
          <h1 className="whitespace-nowrap text-[clamp(56px,15vw,150px)] font-bold leading-none text-text-primary">News</h1>
          <p className="mt-4 text-[clamp(16px,4vw,20px)] text-text-muted">온도와 전통문화의 소식을 전합니다.</p>

          {/* 필터칩 */}
          <div className="mt-8 flex flex-wrap gap-[10px]">
            {CHIPS.map((c) => (
              <span
                key={c.label}
                className={`flex h-[44px] items-center justify-center rounded-[22px] border px-4 text-[14px] font-medium ${
                  c.active ? "border-text-primary bg-text-primary text-[#fefefe]" : "border-border-base text-text-primary"
                }`}
              >
                {c.label}
              </span>
            ))}
          </div>

          {/* 카드 그리드 */}
          <div className="mt-8 grid grid-cols-1 gap-x-[40px] gap-y-[30px] sm:grid-cols-2 lg:grid-cols-3">
            {CARDS.map((c, i) => (
              <div key={i}>
                <div className="relative aspect-[400/260] w-full rounded-[4px] bg-surface-muted">
                  {c.ext && (
                    <span className="absolute right-4 top-4 text-[12px] font-medium text-text-primary">외부 링크 ↗</span>
                  )}
                </div>
                <span className="mt-4 inline-flex h-[24px] items-center rounded-[12px] border border-border-base bg-[#fefefe] px-[10px] text-[12px] text-text-primary">
                  {c.cat}
                </span>
                <p className="mt-3 text-[18px] font-medium text-text-primary">{c.title}</p>
                <p className="mt-1.5 whitespace-pre-wrap text-[13px] text-[#999]">{c.meta}</p>
              </div>
            ))}
          </div>

          {/* 더보기 */}
          <div className="mt-10 flex justify-center">
            <button
              type="button"
              className="flex h-[52px] w-[200px] items-center justify-center rounded-[26px] border border-border-base bg-[#fefefe] text-[15px] font-medium text-text-primary"
            >
              다음 소식 보기
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
