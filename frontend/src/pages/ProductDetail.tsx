import type { ReactNode } from "react";

/**
 * Product Detail — Figma 49:2 "Product Detail / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout). 헤더 하단 구분선은 전 페이지 제거 방침에 따라 생략.
 * 구성: 브레드크럼 + 갤러리(560×700 + 썸네일4) / 상품정보(628, 보유자 카드·수량·구매) + 스토리 + 관련상품.
 * 타이포 Inter(한글 Pretendard 폴백), 색은 토큰/피그마 값 1:1.
 *
 * ≥1280: Figma 1440 콘텐츠존을 max-w-[1280px] 캔버스에 절대좌표로 재현. 좌표=(figmaX-80, figmaY-120).
 * <1280: 세로 스택 반응형.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

const RELATED_COLS = [0, 430, 860]; // 캔버스 좌표 (figma 80/510/940)

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

export default function ProductDetail() {
  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <div className="relative mx-auto h-[1990px] max-w-[1280px]">
          {/* 브레드크럼 — 49:6 */}
          <A l={0} t={4} cls="whitespace-pre text-[14px] text-text-muted">
            {"Shop   ›   윤종국 · 악기장   ›   미니어처 전통 북"}
          </A>

          {/* ── Gallery (245:381) ── */}
          <div className="absolute bg-surface-muted" style={{ left: 0, top: 50, width: 560, height: 700 }} />
          <A l={0} t={385} w={560} cls="text-center text-[14px] text-[#999]">상품 이미지 4:5 — 준비 중</A>
          {[0, 136, 272, 408].map((x) => (
            <div key={x} className="absolute bg-surface-muted" style={{ left: x, top: 774, width: 120, height: 120 }} />
          ))}

          {/* ── Product info (245:383) ── */}
          <div className="absolute rounded-full bg-accent" style={{ left: 632, top: 60, width: 10, height: 10 }} />
          <A l={654} t={56} cls="whitespace-nowrap text-[14px] font-medium text-text-muted">GOODS · 소품</A>
          <A l={632} t={86} cls="whitespace-nowrap text-[42px] font-bold text-text-primary">미니어처 전통 북</A>
          <A l={632} t={158} cls="whitespace-nowrap text-[30px] font-bold text-text-primary">45,000원</A>
          <A l={632} t={218} w={628} cls="text-[17px] leading-[1.6] text-text-muted">
            가죽을 씌워 소리를 되살리는 북메우기, 4대 가업 윤종국 악기장의 손끝에서 태어난 미니어처 전통 북. — 상세 설명 준비 중
          </A>

          {/* Artisan card (245:382) */}
          <div
            className="absolute rounded-[16px] border border-border-base bg-[#fefefe]"
            style={{ left: 632, top: 312, width: 628, height: 100 }}
          />
          <div className="absolute rounded-full bg-surface-muted" style={{ left: 652, top: 332, width: 60, height: 60 }} />
          <A l={728} t={338} cls="whitespace-pre text-[16px] font-bold text-text-primary">{"윤종국  악기장"}</A>
          <A l={728} t={364} cls="whitespace-pre text-[14px] text-text-muted">{"4대 가업, 북메우기  →  보유자 랜딩 연결"}</A>

          {/* 수량 + 구매 */}
          <A l={632} t={450} cls="whitespace-nowrap text-[14px] font-medium text-text-primary">수량</A>
          <div
            className="absolute rounded-[8px] border border-border-base bg-[#fefefe]"
            style={{ left: 632, top: 472, width: 110, height: 48 }}
          />
          <A l={648} t={486} cls="whitespace-pre text-[15px] leading-[1.6] text-text-primary">{"1   −   +"}</A>
          <div
            className="absolute flex items-center justify-center rounded-[28px] bg-primary"
            style={{ left: 632, top: 540, width: 628, height: 56 }}
          >
            <span className="text-[16px] font-medium text-text-primary">주문하기</span>
          </div>

          {/* ── Story (245:384) ── */}
          <div className="absolute bg-border-base" style={{ left: 0, top: 950, width: 1280, height: 1 }} />
          <div className="absolute rounded-full bg-accent" style={{ left: 0, top: 1002, width: 10, height: 10 }} />
          <A l={22} t={998} cls="whitespace-nowrap text-[14px] font-medium text-text-muted">STORY</A>
          <A l={0} t={1028} cls="whitespace-nowrap text-[34px] font-bold text-text-primary">상품 이야기</A>
          <div
            className="absolute border border-dashed border-border-base bg-surface-muted"
            style={{ left: 0, top: 1094, width: 1280, height: 240 }}
          />
          <A l={0} t={1208} w={1280} cls="text-center text-[14px] text-[#999]">
            상세 설명 (마크다운) 준비 중 — 제작 과정 · 소재 · 사용 안내
          </A>

          {/* ── Related / products (245:388) ── */}
          <A l={0} t={1410} cls="whitespace-nowrap text-[30px] font-bold text-text-primary">윤종국의 다른 상품</A>
          <A l={1180} t={1418} w={100} cls="text-right text-[14px] text-text-primary">전체 보기</A>
          {RELATED_COLS.map((x) => (
            <span key={x}>
              <div className="absolute bg-surface-muted" style={{ left: x, top: 1470, width: 420, height: 360 }} />
              <A l={x} t={1846} w={420} cls="text-center text-[12px] text-[#999]">윤종국 · 악기장</A>
              <A l={x} t={1868} w={420} cls="text-center text-[15px] font-medium text-text-primary">[상품 준비 중]</A>
              <A l={x} t={1894} w={420} cls="text-center text-[14px] font-bold text-[#999]">—</A>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-6 sm:px-6">
          <p className="whitespace-pre-wrap text-[14px] text-text-muted">
            {"Shop  ›  윤종국 · 악기장  ›  미니어처 전통 북"}
          </p>

          {/* 갤러리 */}
          <div className="mt-6 flex aspect-[560/700] w-full items-center justify-center bg-surface-muted">
            <span className="text-[14px] text-[#999]">상품 이미지 4:5 — 준비 중</span>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-[16px]">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="aspect-square w-full bg-surface-muted" />
            ))}
          </div>

          {/* 상품 정보 */}
          <div className="mt-10">
            <p className="flex items-center gap-2 text-[14px] font-medium text-text-muted">
              <span className="h-[10px] w-[10px] rounded-full bg-accent" />
              GOODS · 소품
            </p>
            <h1 className="mt-3 text-[clamp(30px,8vw,42px)] font-bold text-text-primary">미니어처 전통 북</h1>
            <p className="mt-3 text-[clamp(24px,6vw,30px)] font-bold text-text-primary">45,000원</p>
            <p className="mt-5 text-[17px] leading-[1.6] text-text-muted">
              가죽을 씌워 소리를 되살리는 북메우기, 4대 가업 윤종국 악기장의 손끝에서 태어난 미니어처 전통 북. — 상세 설명 준비 중
            </p>

            <div className="mt-6 flex items-center gap-4 rounded-[16px] border border-border-base bg-[#fefefe] p-5">
              <div className="h-[60px] w-[60px] shrink-0 rounded-full bg-surface-muted" />
              <div>
                <p className="text-[16px] font-bold text-text-primary">{"윤종국  악기장"}</p>
                <p className="mt-1 text-[14px] text-text-muted">{"4대 가업, 북메우기  →  보유자 랜딩 연결"}</p>
              </div>
            </div>

            <p className="mt-6 text-[14px] font-medium text-text-primary">수량</p>
            <div className="mt-2 flex h-[48px] w-[110px] items-center rounded-[8px] border border-border-base bg-[#fefefe] px-4 text-[15px]">
              {"1   −   +"}
            </div>
            <button
              type="button"
              className="mt-5 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary"
            >
              주문하기
            </button>
          </div>

          {/* 스토리 */}
          <div className="mt-12 border-t border-border-base pt-10">
            <p className="flex items-center gap-2 text-[14px] font-medium text-text-muted">
              <span className="h-[10px] w-[10px] rounded-full bg-accent" />
              STORY
            </p>
            <h2 className="mt-3 text-[clamp(26px,7vw,34px)] font-bold text-text-primary">상품 이야기</h2>
            <div className="mt-6 flex h-[240px] items-center justify-center border border-dashed border-border-base bg-surface-muted px-4 text-center">
              <span className="text-[14px] text-[#999]">상세 설명 (마크다운) 준비 중 — 제작 과정 · 소재 · 사용 안내</span>
            </div>
          </div>

          {/* 관련 상품 */}
          <div className="mt-12">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[clamp(22px,6vw,30px)] font-bold text-text-primary">윤종국의 다른 상품</h2>
              <span className="text-[14px] text-text-primary">전체 보기</span>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-x-[10px] gap-y-8 sm:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <div className="aspect-[420/360] w-full bg-surface-muted" />
                  <p className="mt-4 text-center text-[12px] text-[#999]">윤종국 · 악기장</p>
                  <p className="mt-1 text-center text-[15px] font-medium text-text-primary">[상품 준비 중]</p>
                  <p className="mt-1 text-center text-[14px] font-bold text-[#999]">—</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
