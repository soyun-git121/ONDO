import { useState, type FormEvent, type ReactNode } from "react";
import { Link } from "react-router-dom";
import FitCanvas from "../components/ui/FitCanvas";
import { getProjects } from "../api/projects";
import { createInquiry } from "../api/inquiries";
import { useFetch } from "../hooks/useFetch";
import { PROJECT_TYPE_LABEL } from "../types/project";
import { INQUIRY_TYPE_LABEL, type InquiryCreateRequest, type InquiryType } from "../types/inquiry";
import { resolveImageUrl } from "../api/client";

/**
 * Collaboration(협업문의) — Figma 55:2 "Collaboration / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout).
 * 구성: 히어로 + 문의 폼(유형칩5 · 입력4 · 텍스트영역 · 제출) + PROOF 협업 실적 카드.
 * 타이포 Inter(한글 Pretendard 폴백), 색은 토큰/피그마 값 1:1.
 *
 * ≥1280: Figma 1440 콘텐츠존을 max-w-[1280px] 캔버스에 절대좌표로 재현. 좌표=(figmaX-80, figmaY-120).
 * <1280: 세로 스택 반응형.
 *
 * PROOF 카드 데이터: GET /api/projects?placement=collaboration —
 *   admin '협업문의 페이지에 노출'로 고른 실적만 내려온다(와이어프레임의 3개 고정이 아님).
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

/**
 * 문의 유형 칩 — 라벨은 types/inquiry.ts의 INQUIRY_TYPE_LABEL을 그대로 쓴다.
 * 여기엔 Figma 실측 좌표만 둔다(예전엔 라벨을 복붙해 둬서 백엔드 enum과 끊겨 있었다).
 */
const CHIP_LAYOUT: { type: InquiryType; x: number; w: number }[] = [
  { type: "B2B_GIFT", x: 0, w: 95 },
  { type: "COLLAB", x: 105, w: 109 },
  { type: "EXPERIENCE", x: 224, w: 95 },
  { type: "B2G", x: 329, w: 127 },
  { type: "ETC", x: 466, w: 95 },
];

/** 입력 필드 — key는 요청 DTO 필드명. 좌표·라벨·플레이스홀더는 Figma 그대로. */
const FIELDS: {
  key: keyof Omit<InquiryCreateRequest, "type" | "message">;
  label: string;
  ph: string;
  type: string;
  x: number;
  lT: number;
  iT: number;
}[] = [
  { key: "companyName", label: "회사·기관명 (필수)", ph: "회사 또는 기관명", type: "text", x: 0, lT: 456, iT: 476 },
  { key: "contactName", label: "담당자 이름 (필수)", ph: "담당자 이름", type: "text", x: 382, lT: 456, iT: 476 },
  { key: "email", label: "이메일 (필수)", ph: "email@example.com", type: "email", x: 0, lT: 550, iT: 570 },
  { key: "phone", label: "연락처 (필수)", ph: "02-000-0000", type: "tel", x: 382, lT: 550, iT: 570 },
];

const MESSAGE_PLACEHOLDER = "예) 명절 선물 패키지 300세트, 예산·일정과 함께 문의드립니다.";

const EMPTY_INQUIRY: InquiryCreateRequest = {
  type: "B2B_GIFT",
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  message: "",
};

/**
 * 입력칸 공통 스타일. 와이어프레임은 사각형 div 위에 플레이스홀더 글자를 따로 얹어 뒀는데,
 * 진짜 input으로 바꾸면서 좌우 패딩 14px(= 원래 글자 x오프셋)로 같은 위치를 재현한다.
 */
const INPUT_CLS =
  "rounded-[8px] border border-border-base bg-[#fefefe] px-[14px] text-[14px] text-text-primary outline-none placeholder:text-[#999] focus:border-text-primary disabled:opacity-60";

/** PROOF 카드 — 3열 그리드. admin '협업문의 노출'로 고른 실적을 최대 6건(2행) 싣는다. */
const CASE_COLS = [0, 440, 880];
const CASE_TOP = 1180; // 첫 행 이미지 상단
const CASE_ROW_H = 430; // 한 행이 차지하는 높이(이미지 240 + 텍스트 + 여백)
const CASE_MAX = 6;

/** 카드 1행일 때의 캔버스 높이(Figma 원안). 행이 늘면 그만큼 더한다. */
const CANVAS_H_BASE = 1740;

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
  const { data, loading, error } = useFetch(
    () => getProjects({ placement: "collaboration", size: CASE_MAX }),
    [],
  );
  const cases = data?.content ?? [];
  const caseRows = Math.max(1, Math.ceil(cases.length / 3));
  // 카드가 2행 이상이면 늘어난 만큼 캔버스를 키운다 — 안 그러면 아래가 잘려 푸터를 파고든다.
  const canvasH = CANVAS_H_BASE + (caseRows - 1) * CASE_ROW_H;
  const emptyText = loading
    ? "불러오는 중…"
    : error
      ? "실적을 불러오지 못했습니다."
      : "노출할 협업 실적이 아직 없습니다.";

  /**
   * 문의 폼 — 데스크톱·모바일 두 섹션이 같은 상태를 공유한다(폭이 바뀌어도 입력이 날아가지 않는다).
   * 전송은 POST /api/inquiries. 접수되면 admin '문의' 메뉴에 쌓인다.
   */
  const [form, setForm] = useState<InquiryCreateRequest>(EMPTY_INQUIRY);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);

  const set = <K extends keyof InquiryCreateRequest>(key: K, value: InquiryCreateRequest[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    setResult(null);
    try {
      await createInquiry(form);
      setForm(EMPTY_INQUIRY);
      setResult({ ok: true, text: "문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다." });
    } catch (err) {
      setResult({
        ok: false,
        text: err instanceof Error ? err.message : "문의 전송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      });
    } finally {
      setSending(false);
    }
  };

  /** 유형 칩 — 선택된 것만 라임 배경(Figma active 상태와 동일). */
  const chipCls = (selected: boolean) =>
    `flex h-[44px] items-center justify-center rounded-[22px] border text-[14px] font-medium text-text-primary transition-colors duration-fast ${
      selected ? "border-text-primary bg-primary" : "border-border-base"
    }`;

  const resultCls = (ok: boolean) => `text-[14px] ${ok ? "text-text-primary" : "text-error"}`;

  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <FitCanvas w={1280} h={canvasH}>
          {/* Hero (248:381) */}
          <A l={0} t={30} cls="whitespace-nowrap text-[64px] font-bold text-text-primary">전통과 함께할</A>
          <A l={0} t={114} cls="whitespace-nowrap text-[64px] font-bold text-text-primary">파트너를 찾습니다</A>
          <A l={0} t={222} w={842} cls="text-[19px] text-text-muted">
            기업 선물, 콜라보, 체험·강연, 공공·기관 협력까지 — 전통을 보유자와 함께 한국의 아름다움을 기획합니다.
          </A>

          {/* Inquiry form (248:383) — form은 static이라 자식들의 절대좌표 기준점(FitCanvas)은 그대로다. */}
          <form onSubmit={submit}>
            <div className="absolute rounded-full bg-accent" style={{ left: 0, top: 316, width: 10, height: 10 }} />
            <A l={22} t={312} cls="whitespace-nowrap text-[16px] font-bold text-text-primary">문의하기</A>
            <A l={0} t={358} cls="whitespace-nowrap text-[13px] font-medium leading-[1.6] text-text-primary">문의 유형 (필수)</A>

            {/* Type chips (248:382) */}
            {CHIP_LAYOUT.map((c) => (
              <button
                key={c.type}
                type="button"
                onClick={() => set("type", c.type)}
                aria-pressed={form.type === c.type}
                className={`absolute ${chipCls(form.type === c.type)}`}
                style={{ left: c.x, top: 382, width: c.w }}
              >
                {INQUIRY_TYPE_LABEL[c.type]}
              </button>
            ))}

            {/* Fields */}
            {FIELDS.map((f) => (
              <span key={f.key}>
                <label
                  htmlFor={`collab-${f.key}`}
                  className="absolute whitespace-nowrap text-[13px] font-medium leading-[1.6] text-text-primary"
                  style={{ left: f.x, top: f.lT }}
                >
                  {f.label}
                </label>
                <input
                  id={`collab-${f.key}`}
                  type={f.type}
                  required
                  disabled={sending}
                  value={form[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.ph}
                  className={`absolute ${INPUT_CLS}`}
                  style={{ left: f.x, top: f.iT, width: 358, height: 48 }}
                />
              </span>
            ))}

            {/* Textarea */}
            <label
              htmlFor="collab-message"
              className="absolute whitespace-nowrap text-[13px] font-medium leading-[1.6] text-text-primary"
              style={{ left: 0, top: 644 }}
            >
              문의 내용 (필수)
            </label>
            <textarea
              id="collab-message"
              required
              disabled={sending}
              value={form.message}
              onChange={(e) => set("message", e.target.value)}
              placeholder={MESSAGE_PLACEHOLDER}
              className={`absolute resize-none py-[18px] ${INPUT_CLS}`}
              style={{ left: 0, top: 664, width: 740, height: 150 }}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              className="absolute flex items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary disabled:opacity-60"
              style={{ left: 0, top: 850, width: 740, height: 56 }}
            >
              {sending ? "보내는 중…" : "협업 문의하기"}
            </button>

            {/* 전송 결과 — 버튼(850+56)과 PROOF 구분선(1020) 사이 여백에 둔다. */}
            {result && (
              <p
                role="status"
                className={`absolute ${resultCls(result.ok)}`}
                style={{ left: 0, top: 922, width: 740 }}
              >
                {result.text}
              </p>
            )}
          </form>

          {/* Proof / cases (248:387) */}
          <div className="absolute bg-border-base" style={{ left: 0, top: 1020, width: 1280, height: 1 }} />
          <div className="absolute rounded-full bg-accent" style={{ left: 0, top: 1074, width: 10, height: 10 }} />
          <A l={22} t={1070} cls="whitespace-nowrap text-[14px] font-medium text-text-muted">PROOF</A>
          <A l={0} t={1102} cls="whitespace-nowrap text-[32px] font-bold leading-[1.15] tracking-[-0.64px] text-text-primary">온도가 만들어온 협업</A>
          <Link to="/projects" className="absolute text-right text-[14px] text-text-primary underline-offset-4 hover:underline" style={{ left: 1170, top: 1110, width: 110 }}>
            전체 실적 보기
          </Link>

          {cases.length === 0 ? (
            <A l={0} t={CASE_TOP} w={1280} cls="text-[15px] text-text-muted">{emptyText}</A>
          ) : (
            cases.map((c, i) => {
              const x = CASE_COLS[i % 3];
              const y = CASE_TOP + Math.floor(i / 3) * CASE_ROW_H;
              return (
                <Link key={c.slug} to={`/projects/${c.slug}`} className="group">
                  {/*
                    태그·성과 칩은 원래 Figma 실측 폭(tagW/metricW)을 박아 뒀지만, 실제 등록 문구는
                    길이가 제각각이라 고정 폭이면 글자가 칩 밖으로 삐져나온다. 내용에 맞춰 늘어나도록
                    inline-flex + 좌우 패딩으로 바꾼다(좌표는 그대로).
                  */}
                  {c.thumbnailUrl ? (
                    <img
                      src={resolveImageUrl(c.thumbnailUrl)}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute rounded-[4px] bg-surface-muted object-cover"
                      style={{ left: x, top: y, width: 400, height: 240 }}
                    />
                  ) : (
                    <div className="absolute rounded-[4px] bg-surface-muted" style={{ left: x, top: y, width: 400, height: 240 }} />
                  )}
                  <span
                    className="absolute inline-flex h-[24px] items-center rounded-[12px] border border-border-base bg-[#fefefe] px-[8px] text-[12px] text-text-primary"
                    style={{ left: x, top: y + 256 }}
                  >
                    {PROJECT_TYPE_LABEL[c.type]}
                  </span>
                  {/* 제목은 카드 폭(400)에 가두고 1줄로 자른다 — 넘치면 옆 칸을 침범한다. */}
                  <A l={x} t={y + 292} w={400} cls="truncate text-[18px] font-bold text-text-primary group-hover:underline">
                    {c.title}
                  </A>
                  {c.clientName && (
                    <A l={x} t={y + 322} w={400} cls="truncate text-[13px] text-[#999]">{c.clientName}</A>
                  )}
                  {c.resultMetric && (
                    <span
                      className="absolute inline-flex h-[26px] max-w-[400px] items-center bg-secondary px-[8px] text-[14px] font-medium text-text-primary"
                      style={{ left: x, top: y + 348 }}
                    >
                      <span className="truncate">{c.resultMetric}</span>
                    </span>
                  )}
                </Link>
              );
            })
          )}
        </FitCanvas>
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
          <form onSubmit={submit} className="mt-12">
            <p className="flex items-center gap-2 text-[16px] font-bold text-text-primary">
              <span className="h-[10px] w-[10px] rounded-full bg-accent" />
              문의하기
            </p>
            <p className="mt-6 text-[13px] font-medium text-text-primary">문의 유형 (필수)</p>
            <div className="mt-3 flex flex-wrap gap-[10px]">
              {CHIP_LAYOUT.map((c) => (
                <button
                  key={c.type}
                  type="button"
                  onClick={() => set("type", c.type)}
                  aria-pressed={form.type === c.type}
                  className={`${chipCls(form.type === c.type)} px-4`}
                >
                  {INQUIRY_TYPE_LABEL[c.type]}
                </button>
              ))}
            </div>

            <div className="mt-6 grid grid-cols-1 gap-x-[24px] gap-y-5 sm:grid-cols-2">
              {FIELDS.map((f) => (
                <label key={f.key} className="block">
                  <span className="text-[13px] font-medium text-text-primary">{f.label}</span>
                  <input
                    type={f.type}
                    required
                    disabled={sending}
                    value={form[f.key]}
                    onChange={(e) => set(f.key, e.target.value)}
                    placeholder={f.ph}
                    className={`mt-2 h-[48px] w-full ${INPUT_CLS}`}
                  />
                </label>
              ))}
            </div>

            <label className="mt-5 block">
              <span className="text-[13px] font-medium text-text-primary">문의 내용 (필수)</span>
              <textarea
                rows={5}
                required
                disabled={sending}
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder={MESSAGE_PLACEHOLDER}
                className={`mt-2 w-full py-[14px] ${INPUT_CLS}`}
              />
            </label>

            <button
              type="submit"
              disabled={sending}
              className="mt-6 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary disabled:opacity-60"
            >
              {sending ? "보내는 중…" : "협업 문의하기"}
            </button>

            {result && (
              <p role="status" className={`mt-4 ${resultCls(result.ok)}`}>
                {result.text}
              </p>
            )}
          </form>

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
              <Link to="/projects" className="whitespace-nowrap text-[14px] text-text-primary underline-offset-4 hover:underline">
                전체 실적 보기
              </Link>
            </div>
            {cases.length === 0 ? (
              <p className="mt-8 text-[15px] text-text-muted">{emptyText}</p>
            ) : (
              <div className="mt-8 grid grid-cols-1 gap-x-[40px] gap-y-[50px] sm:grid-cols-2 lg:grid-cols-3">
                {cases.map((c) => (
                  <Link key={c.slug} to={`/projects/${c.slug}`} className="group block">
                    {c.thumbnailUrl ? (
                      <img
                        src={resolveImageUrl(c.thumbnailUrl)}
                        alt=""
                        loading="lazy"
                        decoding="async"
                        className="aspect-[400/240] w-full rounded-[4px] bg-surface-muted object-cover"
                      />
                    ) : (
                      <div className="aspect-[400/240] w-full rounded-[4px] bg-surface-muted" />
                    )}
                    <span className="mt-4 inline-flex h-[24px] items-center rounded-[12px] border border-border-base bg-[#fefefe] px-[8px] text-[12px] text-text-primary">
                      {PROJECT_TYPE_LABEL[c.type]}
                    </span>
                    <p className="mt-3 text-[18px] font-bold text-text-primary group-hover:underline">
                      {c.title}
                    </p>
                    {c.clientName && <p className="mt-2 text-[13px] text-[#999]">{c.clientName}</p>}
                    {c.resultMetric && (
                      <span className="mt-3 inline-flex h-[26px] items-center bg-secondary px-[8px] text-[14px] font-medium text-text-primary">
                        {c.resultMetric}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
