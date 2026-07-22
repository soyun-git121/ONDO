import type { ReactNode } from "react";

/**
 * News · Detail — Figma 53:62 "News · Detail / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout). 760px 중앙 정렬 아티클.
 * 구성: 목록 링크 + 카테고리 pill + 제목(44) + 메타 + 대표 이미지 + 본문 패널(dashed) + 하단 링크.
 * 타이포 Inter(한글 Pretendard 폴백), 색은 토큰/피그마 값 1:1.
 *
 * ≥1280: Figma 1440 콘텐츠존을 max-w-[1280px] 캔버스에 절대좌표로 재현. 좌표=(figmaX-80, figmaY-120).
 *        아티클(figma x340~1100 = 760)은 캔버스 left 260(중앙). <1280: 세로 스택 반응형.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";
const X = 260; // 캔버스 좌표 (figma 340 - 80) — 760px 아티클 좌측
const W = 760;

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

export default function NewsDetail() {
  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <div className="relative mx-auto h-[1300px] max-w-[1280px]">
          {/* 목록 링크 — 53:66 */}
          <A l={X} t={4} cls="whitespace-pre text-[14px] text-text-muted">{"‹  News 목록"}</A>

          {/* Article (247:391) */}
          <div
            className="absolute flex h-[24px] items-center justify-center rounded-[12px] border border-border-base bg-[#fefefe] text-[12px] text-text-primary"
            style={{ left: X, top: 48, width: 68 }}
          >
            온도 소식
          </div>
          <A l={X} t={92} w={W} cls="text-[44px] font-bold leading-[normal] text-text-primary">[뉴스 제목]</A>
          <A l={X} t={180} cls="whitespace-pre text-[15px] leading-[1.6] text-text-muted">
            {"2026. 7. 1.      ·      윤종국 · 악기장"}
          </A>

          {/* 대표 이미지 */}
          <div className="absolute rounded-[4px] bg-surface-muted" style={{ left: X, top: 232, width: W, height: 420 }} />
          <A l={X} t={434} w={W} cls="text-center text-[14px] text-[#999]">대표 이미지 — 준비 중</A>

          {/* 본문 패널 (dashed) */}
          <div
            className="absolute rounded-[4px] border border-dashed border-border-base bg-surface-muted"
            style={{ left: X, top: 692, width: W, height: 420 }}
          />
          <A l={X} t={894} w={W} cls="text-center text-[14px] text-[#999]">본문 (마크다운) — 원고 준비 중</A>

          {/* Article footer (247:392) */}
          <A l={X} t={1162} w={W} cls="text-center text-[14px] text-text-primary">{"‹  News 목록으로 돌아가기"}</A>
        </div>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[760px] px-4 pb-12 pt-6 sm:px-6">
          <p className="whitespace-pre text-[14px] text-text-muted">{"‹  News 목록"}</p>

          <span className="mt-6 inline-flex h-[24px] items-center rounded-[12px] border border-border-base bg-[#fefefe] px-[10px] text-[12px] text-text-primary">
            온도 소식
          </span>
          <h1 className="mt-4 text-[clamp(30px,8vw,44px)] font-bold text-text-primary">[뉴스 제목]</h1>
          <p className="mt-4 whitespace-pre-wrap text-[15px] leading-[1.6] text-text-muted">
            {"2026. 7. 1.   ·   윤종국 · 악기장"}
          </p>

          <div className="mt-6 flex aspect-[760/420] w-full items-center justify-center rounded-[4px] bg-surface-muted">
            <span className="text-[14px] text-[#999]">대표 이미지 — 준비 중</span>
          </div>

          <div className="mt-6 flex aspect-[760/420] w-full items-center justify-center rounded-[4px] border border-dashed border-border-base bg-surface-muted px-4 text-center">
            <span className="text-[14px] text-[#999]">본문 (마크다운) — 원고 준비 중</span>
          </div>

          <p className="mt-10 text-center text-[14px] text-text-primary">{"‹  News 목록으로 돌아가기"}</p>
        </div>
      </section>
    </main>
  );
}
