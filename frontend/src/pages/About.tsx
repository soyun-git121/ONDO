/**
 * About — Figma 41:2 "About / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout). 본문 = Hero + 3섹션(Mission/Vision/Core Value).
 * 타이포는 Figma 그대로 Inter(한글은 Pretendard 폴백), 색은 토큰과 1:1(#f2f2f2/#e5e5e5/#666).
 *
 * ≥1280: Figma 1440 콘텐츠존(x80~1360)을 max-w-[1280px] 캔버스에 절대좌표로 재현.
 *        좌표 = (figmaX-80, figmaY-120). <1280: 세로 스택으로 반응형.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

const SECTIONS = [
  { n: "01", title: "Mission", body: "introduction 원고 준비 중 (추진배경·문제의식)", caption: "이미지 준비 중" },
  { n: "02", title: "Vision", body: "identity 원고 준비 중 (온도의 의미·비전)", caption: "이미지 준비 중" },
  { n: "03", title: "Core Value", body: "운영 프로세스 다이어그램 준비 중", caption: "다이어그램 준비 중" },
];

/** ● 라임 뱃지 도트 (figma badge/dot, 10×10) */
function Dot({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block size-[10px] rounded-full bg-accent ${className}`} />;
}

/** 이미지 자리 — dashed 테두리 + surface-muted, 캡션 중앙 (figma image/placeholder) */
function Placeholder({ caption, className = "" }: { caption: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center border border-dashed border-border-base bg-surface-muted ${className}`}
    >
      <span className="text-[14px] text-text-muted">{caption}</span>
    </div>
  );
}

export default function About() {
  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <div className="relative mx-auto h-[1680px] max-w-[1280px]">
          {/* Hero / intro — 43:4 : Inter Bold 150px, tracking -4px */}
          <h1 className="absolute left-[-8px] top-[30px] whitespace-nowrap text-[150px] font-bold leading-none tracking-[-4px] text-text-primary">
            ABOUT
          </h1>

          {/* ── Section 01 Mission (241:54) — 이미지 좌, 텍스트 우 ── */}
          <Placeholder caption="이미지 준비 중" className="absolute left-[12px] top-[293px] h-[340px] w-[600px]" />
          <Dot className="absolute left-[692px] top-[301px]" />
          <p className="absolute left-[714px] top-[295px] whitespace-nowrap text-[14px] font-medium text-text-muted">
            01
          </p>
          <p className="absolute left-[692px] top-[327px] whitespace-nowrap text-[34px] font-bold text-text-primary">
            Mission
          </p>
          <p className="absolute left-[692px] top-[389px] w-[560px] text-[15px] leading-[1.6] text-text-muted">
            introduction 원고 준비 중 (추진배경·문제의식)
          </p>

          {/* ── Section 02 Vision (241:55) — 이미지 우, 텍스트 좌 ── */}
          <Placeholder caption="이미지 준비 중" className="absolute left-[692px] top-[733px] h-[340px] w-[600px]" />
          <Dot className="absolute left-0 top-[739px]" />
          <p className="absolute left-[34px] top-[735px] whitespace-nowrap text-[14px] font-medium text-text-muted">
            02
          </p>
          <p className="absolute left-[12px] top-[767px] whitespace-nowrap text-[34px] font-bold text-text-primary">
            Vision
          </p>
          <p className="absolute left-[12px] top-[829px] w-[560px] text-[15px] leading-[1.6] text-text-muted">
            identity 원고 준비 중 (온도의 의미·비전)
          </p>

          {/* ── Section 03 Core Value (241:56) — 이미지 좌, 텍스트 우 ── */}
          <Placeholder caption="다이어그램 준비 중" className="absolute left-[12px] top-[1253px] h-[340px] w-[600px]" />
          <Dot className="absolute left-[692px] top-[1261px]" />
          <p className="absolute left-[714px] top-[1255px] whitespace-nowrap text-[14px] font-medium text-text-muted">
            03
          </p>
          <p className="absolute left-[692px] top-[1287px] whitespace-nowrap text-[34px] font-bold text-text-primary">
            Core Value
          </p>
          <p className="absolute left-[692px] top-[1349px] w-[560px] text-[15px] leading-[1.6] text-text-muted">
            운영 프로세스 다이어그램 준비 중
          </p>
        </div>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6">
          <h1 className="whitespace-nowrap text-[clamp(56px,15vw,150px)] font-bold leading-none tracking-[-0.03em] text-text-primary">
            ABOUT
          </h1>

          <div className="mt-10 flex flex-col gap-12">
            {SECTIONS.map((s) => (
              <div key={s.n}>
                <Placeholder caption={s.caption} className="aspect-[600/340] w-full" />
                <div className="mt-4">
                  <p className="flex items-center gap-2 text-[14px] font-medium text-text-muted">
                    <Dot />
                    {s.n}
                  </p>
                  <h2 className="mt-2 text-[34px] font-bold leading-tight text-text-primary">{s.title}</h2>
                  <p className="mt-3 max-w-[560px] text-[15px] leading-[1.6] text-text-muted">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
