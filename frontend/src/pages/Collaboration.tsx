import type { ReactNode } from "react";

/**
 * Collaboration(협업문의) — Figma 55:2 "Collaboration / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout).
 * 구성: 히어로 + 문의 폼(유형칩5 · 입력4 · 텍스트영역 · 제출) + PROOF 협업 실적 카드3.
 * 타이포 Inter(한글 Pretendard 폴백), 색은 토큰/피그마 값 1:1.
 *
 * ≥1280: Figma 1440 콘텐츠존을 max-w-[1280px] 캔버스에 절대좌표로 재현. 좌표=(figmaX-80, figmaY-120).
 * <1280: 세로 스택 반응형.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

const CHIPS = [
  { label: "기업 선물", x: 0, w: 95, active: true },
  { label: "콜라보 제안", x: 105, w: 109 },
  { label: "체험·강연", x: 224, w: 95 },
  { label: "공공·기관 협력", x: 329, w: 127 },
  { label: "기타 문의", x: 466, w: 95 },
];

const FIELDS = [
  { label: "회사·기관명 (필수)", ph: "회사 또는 기관명", x: 0, lT: 456, iT: 476 },
  { label: "담당자 이름 (필수)", ph: "담당자 이름", x: 382, lT: 456, iT: 476 },
  { label: "이메일 (필수)", ph: "email@example.com", x: 0, lT: 550, iT: 570 },
  { label: "연락처 (필수)", ph: "02-000-0000", x: 382, lT: 550, iT: 570 },
];

interface Case {
  col: number;
  tag: string;
  tagW: number;
  title: string;
  client: string;
  metric: string;
  metricW: number;
  hi?: boolean;
}
const CASES: Case[] = [
  { col: 0, tag: "펀딩", tagW: 43, title: "장도 텀블벅 펀딩", client: "텀블벅", metric: "펀딩률 9,800% 달성", metricW: 139, hi: true },
  { col: 440, tag: "기업 선물", tagW: 68, title: "[협업 실적]", client: "[클라이언트]", metric: "[성과 지표]", metricW: 82 },
  { col: 880, tag: "콜라보", tagW: 54, title: "[협업 실적]", client: "[클라이언트]", metric: "[성과 지표]", metricW: 82 },
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

export default function Collaboration() {
  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <div className="relative mx-auto h-[1740px] max-w-[1280px]">
          {/* Hero (248:381) */}
          <A l={0} t={30} cls="whitespace-nowrap text-[64px] font-bold text-text-primary">전통과 함께할</A>
          <A l={0} t={114} cls="whitespace-nowrap text-[64px] font-bold text-text-primary">파트너를 찾습니다</A>
          <A l={0} t={222} w={842} cls="text-[19px] text-text-muted">
            기업 선물, 콜라보, 체험·강연, 공공·기관 협력까지 — 전통을 보유자와 함께 한국의 아름다움을 기획합니다.
          </A>

          {/* Inquiry form (248:383) */}
          <div className="absolute rounded-full bg-accent" style={{ left: 0, top: 316, width: 10, height: 10 }} />
          <A l={22} t={312} cls="whitespace-nowrap text-[16px] font-bold text-text-primary">문의하기</A>
          <A l={0} t={358} cls="whitespace-nowrap text-[13px] font-medium leading-[1.6] text-text-primary">문의 유형 (필수)</A>

          {/* Type chips (248:382) */}
          {CHIPS.map((c) => (
            <div
              key={c.label}
              className={`absolute flex h-[44px] items-center justify-center rounded-[22px] border text-[14px] font-medium text-text-primary ${
                c.active ? "border-text-primary bg-primary" : "border-border-base"
              }`}
              style={{ left: c.x, top: 382, width: c.w }}
            >
              {c.label}
            </div>
          ))}

          {/* Fields */}
          {FIELDS.map((f) => (
            <span key={f.label}>
              <A l={f.x} t={f.lT} cls="whitespace-nowrap text-[13px] font-medium leading-[1.6] text-text-primary">{f.label}</A>
              <div
                className="absolute rounded-[8px] border border-border-base bg-[#fefefe]"
                style={{ left: f.x, top: f.iT, width: 358, height: 48 }}
              />
              <A l={f.x + 14} t={f.iT + 17} cls="whitespace-nowrap text-[14px] text-[#999]">{f.ph}</A>
            </span>
          ))}

          {/* Textarea */}
          <A l={0} t={644} cls="whitespace-nowrap text-[13px] font-medium leading-[1.6] text-text-primary">문의 내용 (필수)</A>
          <div
            className="absolute rounded-[8px] border border-border-base bg-[#fefefe]"
            style={{ left: 0, top: 664, width: 740, height: 150 }}
          />
          <A l={14} t={682} cls="whitespace-nowrap text-[14px] text-[#999]">예) 명절 선물 패키지 300세트, 예산·일정과 함께 문의드립니다.</A>

          {/* Submit */}
          <div
            className="absolute flex items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary"
            style={{ left: 0, top: 850, width: 740, height: 56 }}
          >
            협업 문의하기
          </div>

          {/* Proof / cases (248:387) */}
          <div className="absolute bg-border-base" style={{ left: 0, top: 1020, width: 1280, height: 1 }} />
          <div className="absolute rounded-full bg-accent" style={{ left: 0, top: 1074, width: 10, height: 10 }} />
          <A l={22} t={1070} cls="whitespace-nowrap text-[14px] font-medium text-text-muted">PROOF</A>
          <A l={0} t={1102} cls="whitespace-nowrap text-[32px] font-bold leading-[1.15] tracking-[-0.64px] text-text-primary">온도가 만들어온 협업</A>
          <A l={1170} t={1110} w={110} cls="text-right text-[14px] text-text-primary">전체 실적 보기</A>

          {CASES.map((c) => {
            const x = c.col;
            const y = 1180; // image top
            return (
              <span key={c.tag + c.title}>
                <div className="absolute rounded-[4px] bg-surface-muted" style={{ left: x, top: y, width: 400, height: 240 }} />
                <div
                  className="absolute flex h-[24px] items-center justify-center rounded-[12px] border border-border-base bg-[#fefefe] text-[12px] text-text-primary"
                  style={{ left: x, top: y + 256, width: c.tagW }}
                >
                  {c.tag}
                </div>
                <A l={x} t={y + 292} cls="whitespace-nowrap text-[18px] font-bold text-text-primary">{c.title}</A>
                <A l={x} t={y + 322} cls="whitespace-nowrap text-[13px] text-[#999]">{c.client}</A>
                <div
                  className={`absolute ${c.hi ? "bg-secondary" : "bg-surface-muted"}`}
                  style={{ left: x, top: y + 348, width: c.metricW, height: 26 }}
                />
                <A l={x + 8} t={y + 353} cls={`whitespace-nowrap text-[14px] font-medium ${c.hi ? "text-text-primary" : "text-[#999]"}`}>
                  {c.metric}
                </A>
              </span>
            );
          })}
        </div>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6">
          <h1 className="text-[clamp(38px,9vw,64px)] font-bold leading-[1.15] text-text-primary">
            전통과 함께할
            <br />
            파트너를 찾습니다
          </h1>
          <p className="mt-6 max-w-[842px] text-[19px] text-text-muted">
            기업 선물, 콜라보, 체험·강연, 공공·기관 협력까지 — 전통을 보유자와 함께 한국의 아름다움을 기획합니다.
          </p>

          {/* 문의 폼 */}
          <div className="mt-12">
            <p className="flex items-center gap-2 text-[16px] font-bold text-text-primary">
              <span className="h-[10px] w-[10px] rounded-full bg-accent" />
              문의하기
            </p>
            <p className="mt-6 text-[13px] font-medium text-text-primary">문의 유형 (필수)</p>
            <div className="mt-3 flex flex-wrap gap-[10px]">
              {CHIPS.map((c) => (
                <span
                  key={c.label}
                  className={`flex h-[44px] items-center justify-center rounded-[22px] border px-4 text-[14px] font-medium text-text-primary ${
                    c.active ? "border-text-primary bg-primary" : "border-border-base"
                  }`}
                >
                  {c.label}
                </span>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-x-[24px] gap-y-5 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <label key={f.label} className="block">
                  <span className="text-[13px] font-medium text-text-primary">{f.label}</span>
                  <input
                    type="text"
                    placeholder={f.ph}
                    className="mt-2 h-[48px] w-full rounded-[8px] border border-border-base bg-[#fefefe] px-[14px] text-[14px] text-text-primary placeholder:text-[#999]"
                  />
                </label>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="text-[13px] font-medium text-text-primary">문의 내용 (필수)</span>
              <textarea
                rows={5}
                placeholder="예) 명절 선물 패키지 300세트, 예산·일정과 함께 문의드립니다."
                className="mt-2 w-full rounded-[8px] border border-border-base bg-[#fefefe] p-[14px] text-[14px] text-text-primary placeholder:text-[#999]"
              />
            </label>

            <button
              type="button"
              className="mt-6 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary"
            >
              협업 문의하기
            </button>
          </div>

          {/* PROOF */}
          <div className="mt-14 border-t border-border-base pt-10">
            <div className="flex items-baseline justify-between">
              <div>
                <p className="flex items-center gap-2 text-[14px] font-medium text-text-muted">
                  <span className="h-[10px] w-[10px] rounded-full bg-accent" />
                  PROOF
                </p>
                <h2 className="mt-2 text-[clamp(24px,7vw,32px)] font-bold leading-[1.15] tracking-[-0.64px] text-text-primary">
                  온도가 만들어온 협업
                </h2>
              </div>
              <span className="whitespace-nowrap text-[14px] text-text-primary">전체 실적 보기</span>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-x-[40px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-3">
              {CASES.map((c) => (
                <div key={c.tag + c.title}>
                  <div className="aspect-[400/240] w-full rounded-[4px] bg-surface-muted" />
                  <span className="mt-4 inline-flex h-[24px] items-center rounded-[12px] border border-border-base bg-[#fefefe] px-[8px] text-[12px] text-text-primary">
                    {c.tag}
                  </span>
                  <p className="mt-3 text-[18px] font-bold text-text-primary">{c.title}</p>
                  <p className="mt-2 text-[13px] text-[#999]">{c.client}</p>
                  <span
                    className={`mt-3 inline-flex h-[26px] items-center px-[8px] text-[14px] font-medium ${
                      c.hi ? "bg-secondary text-text-primary" : "bg-surface-muted text-[#999]"
                    }`}
                  >
                    {c.metric}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
