import type { ReactNode } from "react";

/**
 * Order · Checkout(주문/결제) — Figma 51:2 "Order · Checkout / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout). 헤더 하단 구분선은 전 페이지 제거 방침에 따라 생략.
 * 구성: 좌측 폼(주문자 정보·배송지·결제 수단) + 우측 주문 요약 패널 + 하단 입금 안내(완료) 섹션.
 * 타이포 Inter(한글 Pretendard 폴백), 색은 토큰/피그마 값 1:1.
 *
 * ≥1280: Figma 1440 콘텐츠존을 max-w-[1280px] 캔버스에 절대좌표로 재현. 좌표=(figmaX-80, figmaY-120).
 * <1280: 세로 스택 반응형.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

interface FieldDef {
  label: string;
  ph: string;
  x: number;
  lT: number;
  iT: number;
  w: number;
  h?: number;
}
const ORDER_FIELDS: FieldDef[] = [
  { label: "이름 (필수)", ph: "이름", x: 0, lT: 216, iT: 236, w: 358 },
  { label: "연락처 (필수)", ph: "010-0000-0000", x: 382, lT: 216, iT: 236, w: 358 },
  { label: "이메일 (필수)", ph: "email@example.com", x: 0, lT: 310, iT: 330, w: 740 },
];
const SHIP_FIELDS: FieldDef[] = [
  { label: "우편번호 (필수)", ph: "우편번호", x: 0, lT: 472, iT: 492, w: 200 },
  { label: "기본 주소 (필수)", ph: "도로명 / 지번 주소", x: 0, lT: 564, iT: 584, w: 740 },
  { label: "상세 주소", ph: "동 / 호수 등", x: 0, lT: 658, iT: 678, w: 740 },
  { label: "배송 메모", ph: "부재 시 문 앞에 놓아주세요", x: 0, lT: 752, iT: 772, w: 740, h: 80 },
];
const SUMMARY_ROWS = [
  { label: "상품 금액", value: "90,000원", top: 354 },
  { label: "배송비", value: "3,000원", top: 382 },
];

/** 절대 배치 텍스트 헬퍼 */
function A({ l, t, w, cls = "", children }: { l: number; t: number; w?: number; cls?: string; children: ReactNode }) {
  return (
    <p className={`absolute ${cls}`} style={{ left: l, top: t, width: w }}>
      {children}
    </p>
  );
}

/** 라벨 + 입력 + placeholder (데스크톱 캔버스) */
function Field({ label, ph, x, lT, iT, w, h = 48 }: FieldDef) {
  return (
    <>
      <A l={x} t={lT} cls="whitespace-nowrap text-[13px] font-medium leading-[1.6] text-text-primary">{label}</A>
      <div className="absolute rounded-[8px] border border-border-base bg-[#fefefe]" style={{ left: x, top: iT, width: w, height: h }} />
      <A l={x + 14} t={iT + 17} cls="whitespace-nowrap text-[14px] text-[#999]">{ph}</A>
    </>
  );
}

export default function OrderPage() {
  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <div className="relative mx-auto h-[1680px] max-w-[1280px]">
          {/* Page header */}
          <A l={0} t={26} cls="whitespace-nowrap text-[46px] font-bold text-text-primary">주문 / 결제</A>

          {/* ── Fieldset 주문자 정보 ── */}
          <div className="absolute rounded-full bg-accent" style={{ left: 0, top: 176, width: 10, height: 10 }} />
          <A l={22} t={172} cls="whitespace-nowrap text-[16px] font-bold text-text-primary">주문자 정보</A>
          {ORDER_FIELDS.map((f) => <Field key={f.label} {...f} />)}

          {/* ── Fieldset 배송지 ── */}
          <div className="absolute rounded-full bg-accent" style={{ left: 0, top: 432, width: 10, height: 10 }} />
          <A l={22} t={428} cls="whitespace-nowrap text-[16px] font-bold text-text-primary">배송지</A>
          {SHIP_FIELDS.map((f) => <Field key={f.label} {...f} />)}
          {/* 주소 찾기 버튼 (검정 테두리) */}
          <div
            className="absolute flex items-center justify-center rounded-[8px] border border-text-primary bg-[#fefefe] text-[14px] font-medium text-text-primary"
            style={{ left: 212, top: 492, width: 120, height: 48 }}
          >
            주소 찾기
          </div>

          {/* ── Fieldset 결제 수단 ── */}
          <div className="absolute rounded-full bg-accent" style={{ left: 0, top: 896, width: 10, height: 10 }} />
          <A l={22} t={892} cls="whitespace-nowrap text-[16px] font-bold text-text-primary">결제 수단</A>
          {/* 선택된 옵션 (무통장 입금) */}
          <div className="absolute rounded-[8px] border-[1.5px] border-text-primary bg-[#fefefe]" style={{ left: 0, top: 932, width: 740, height: 64 }} />
          <div className="absolute rounded-full border border-text-primary" style={{ left: 22, top: 954, width: 18, height: 18 }} />
          <div className="absolute rounded-full bg-text-primary" style={{ left: 27, top: 959, width: 8, height: 8 }} />
          <A l={56} t={946} cls="whitespace-nowrap text-[15px] font-bold text-text-primary">무통장 입금</A>
          <A l={56} t={968} cls="whitespace-nowrap text-[13px] text-text-muted">주문 후 입금 안내 화면 제공 · 실결제 없음 (Phase 4 PG 연동 전)</A>
          {/* 비활성 옵션 */}
          <div className="absolute rounded-[8px] border border-border-base bg-surface-muted" style={{ left: 0, top: 1012, width: 740, height: 56 }} />
          <A l={22} t={1032} cls="whitespace-nowrap text-[14px] text-[#999]">카드 결제 · 간편결제 — 준비 중</A>

          {/* ── Order summary 패널 (우측, 캔버스 left 800) ── */}
          <div className="absolute rounded-[16px] border border-border-base bg-[#fefefe]" style={{ left: 800, top: 172, width: 480, height: 468 }} />
          <A l={828} t={200} cls="whitespace-nowrap text-[20px] font-bold text-text-primary">주문 요약</A>
          <div className="absolute rounded-[8px] bg-surface-muted" style={{ left: 828, top: 244, width: 64, height: 64 }} />
          <A l={908} t={246} cls="whitespace-nowrap text-[15px] font-medium text-text-primary">미니어처 전통 북</A>
          <A l={908} t={268} cls="whitespace-nowrap text-[12px] text-[#999]">윤종국 · 악기장</A>
          <A l={908} t={290} cls="whitespace-nowrap text-[13px] text-text-muted">수량 2</A>
          <A l={1100} t={246} w={152} cls="text-right text-[14px] font-bold text-text-primary">90,000원</A>
          <div className="absolute bg-border-base" style={{ left: 828, top: 332, width: 424, height: 1 }} />
          {SUMMARY_ROWS.map((r) => (
            <span key={r.label}>
              <A l={828} t={r.top} cls="whitespace-nowrap text-[14px] text-text-muted">{r.label}</A>
              <A l={1100} t={r.top} w={152} cls="text-right text-[14px] text-text-primary">{r.value}</A>
            </span>
          ))}
          <div className="absolute bg-border-base" style={{ left: 828, top: 418, width: 424, height: 1 }} />
          <A l={828} t={440} cls="whitespace-nowrap text-[16px] font-bold text-text-primary">합계</A>
          <A l={1070} t={432} w={182} cls="text-right text-[22px] font-bold text-text-primary">93,000원</A>
          <div className="absolute rounded-[4px] border border-text-primary bg-[#fefefe]" style={{ left: 828, top: 488, width: 18, height: 18 }} />
          <A l={856} t={490} cls="whitespace-nowrap text-[13px] text-text-primary">주문 내용 확인 및 동의 (필수)</A>
          <div
            className="absolute flex items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary"
            style={{ left: 828, top: 528, width: 424, height: 56 }}
          >
            주문하기
          </div>
          <A l={828} t={598} w={424} cls="text-center text-[12px] text-[#999]">주문 접수 후 입금 안내를 확인해 주세요 · 실결제 없음</A>

          {/* ── Payment guide (완료) ── */}
          <div className="absolute bg-border-base" style={{ left: 0, top: 1130, width: 1280, height: 1 }} />
          <div className="absolute rounded-full bg-accent" style={{ left: 0, top: 1174, width: 10, height: 10 }} />
          <A l={22} t={1170} cls="whitespace-pre text-[16px] font-bold text-text-primary">{"제출 후  →  입금 안내 (주문 완료)"}</A>
          <div className="absolute rounded-[16px] border border-border-base bg-[#fefefe]" style={{ left: 0, top: 1220, width: 1280, height: 380 }} />
          <A l={0} t={1264} w={1280} cls="text-center text-[30px] font-bold text-text-primary">주문이 접수되었습니다</A>
          <A l={0} t={1310} w={1280} cls="whitespace-pre-wrap text-center text-[15px] leading-[1.6] text-text-muted">{"주문번호  ONDO-20260712-A3F9K2"}</A>
          <div className="absolute rounded-[12px] bg-surface-muted" style={{ left: 220, top: 1366, width: 840, height: 160 }} />
          <A l={252} t={1392} cls="whitespace-nowrap text-[16px] font-bold text-text-primary">입금 안내</A>
          <A l={252} t={1426} cls="whitespace-pre text-[15px] leading-[1.6] text-text-primary">{"결제 금액  93,000원"}</A>
          <A l={252} t={1456} cls="whitespace-pre text-[14px] text-text-muted">{"입금 계좌  (정보 준비 중)"}</A>
          <A l={252} t={1486} cls="whitespace-nowrap text-[13px] text-[#999]">입금 확인 후 상품 준비 시작 — PAID 전이는 admin 수동 처리 (실결제 없음)</A>
          <A l={0} t={1552} w={1280} cls="text-center text-[14px] text-text-primary">홈으로 돌아가기</A>
        </div>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[820px] px-4 pb-12 pt-8 sm:px-6">
          <h1 className="text-[clamp(32px,8vw,46px)] font-bold text-text-primary">주문 / 결제</h1>

          {/* 주문자 정보 */}
          <FormSection title="주문자 정보">
            <div className="grid grid-cols-1 gap-x-[24px] gap-y-5 sm:grid-cols-2">
              <MField label="이름 (필수)" ph="이름" />
              <MField label="연락처 (필수)" ph="010-0000-0000" />
              <div className="sm:col-span-2">
                <MField label="이메일 (필수)" ph="email@example.com" />
              </div>
            </div>
          </FormSection>

          {/* 배송지 */}
          <FormSection title="배송지">
            <div className="flex items-end gap-3">
              <div className="w-[200px] max-w-[55%]">
                <MField label="우편번호 (필수)" ph="우편번호" />
              </div>
              <button type="button" className="h-[48px] w-[120px] shrink-0 rounded-[8px] border border-text-primary bg-[#fefefe] text-[14px] font-medium text-text-primary">
                주소 찾기
              </button>
            </div>
            <div className="mt-5"><MField label="기본 주소 (필수)" ph="도로명 / 지번 주소" /></div>
            <div className="mt-5"><MField label="상세 주소" ph="동 / 호수 등" /></div>
            <label className="mt-5 block">
              <span className="text-[13px] font-medium text-text-primary">배송 메모</span>
              <textarea rows={2} placeholder="부재 시 문 앞에 놓아주세요" className="mt-2 w-full rounded-[8px] border border-border-base bg-[#fefefe] p-[14px] text-[14px] text-text-primary placeholder:text-[#999]" />
            </label>
          </FormSection>

          {/* 결제 수단 */}
          <FormSection title="결제 수단">
            <div className="flex items-start gap-3 rounded-[8px] border-[1.5px] border-text-primary bg-[#fefefe] p-4">
              <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-text-primary">
                <span className="h-[8px] w-[8px] rounded-full bg-text-primary" />
              </span>
              <div>
                <p className="text-[15px] font-bold text-text-primary">무통장 입금</p>
                <p className="mt-1 text-[13px] text-text-muted">주문 후 입금 안내 화면 제공 · 실결제 없음 (Phase 4 PG 연동 전)</p>
              </div>
            </div>
            <div className="mt-4 flex h-[56px] items-center rounded-[8px] border border-border-base bg-surface-muted px-[22px] text-[14px] text-[#999]">
              카드 결제 · 간편결제 — 준비 중
            </div>
          </FormSection>

          {/* 주문 요약 */}
          <div className="mt-10 rounded-[16px] border border-border-base bg-[#fefefe] p-6">
            <p className="text-[20px] font-bold text-text-primary">주문 요약</p>
            <div className="mt-4 flex gap-4">
              <div className="h-[64px] w-[64px] shrink-0 rounded-[8px] bg-surface-muted" />
              <div className="flex-1">
                <p className="text-[15px] font-medium text-text-primary">미니어처 전통 북</p>
                <p className="mt-1 text-[12px] text-[#999]">윤종국 · 악기장</p>
                <p className="mt-1 text-[13px] text-text-muted">수량 2</p>
              </div>
              <p className="text-[14px] font-bold text-text-primary">90,000원</p>
            </div>
            <div className="my-5 border-t border-border-base" />
            {SUMMARY_ROWS.map((r) => (
              <div key={r.label} className="flex justify-between py-1 text-[14px]">
                <span className="text-text-muted">{r.label}</span>
                <span className="text-text-primary">{r.value}</span>
              </div>
            ))}
            <div className="my-5 border-t border-border-base" />
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-text-primary">합계</span>
              <span className="text-[22px] font-bold text-text-primary">93,000원</span>
            </div>
            <label className="mt-5 flex items-center gap-2">
              <span className="h-[18px] w-[18px] rounded-[4px] border border-text-primary bg-[#fefefe]" />
              <span className="text-[13px] text-text-primary">주문 내용 확인 및 동의 (필수)</span>
            </label>
            <button type="button" className="mt-4 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary">
              주문하기
            </button>
            <p className="mt-4 text-center text-[12px] text-[#999]">주문 접수 후 입금 안내를 확인해 주세요 · 실결제 없음</p>
          </div>

          {/* 입금 안내 (완료) */}
          <div className="mt-12 border-t border-border-base pt-10">
            <p className="flex items-center gap-2 text-[16px] font-bold text-text-primary">
              <span className="h-[10px] w-[10px] rounded-full bg-accent" />
              {"제출 후  →  입금 안내 (주문 완료)"}
            </p>
            <div className="mt-6 rounded-[16px] border border-border-base bg-[#fefefe] px-4 py-10">
              <p className="text-center text-[clamp(24px,7vw,30px)] font-bold text-text-primary">주문이 접수되었습니다</p>
              <p className="mt-3 text-center text-[15px] leading-[1.6] text-text-muted">{"주문번호  ONDO-20260712-A3F9K2"}</p>
              <div className="mx-auto mt-8 max-w-[840px] rounded-[12px] bg-surface-muted p-6">
                <p className="text-[16px] font-bold text-text-primary">입금 안내</p>
                <p className="mt-3 text-[15px] leading-[1.6] text-text-primary">{"결제 금액  93,000원"}</p>
                <p className="mt-1 text-[14px] text-text-muted">{"입금 계좌  (정보 준비 중)"}</p>
                <p className="mt-1 text-[13px] text-[#999]">입금 확인 후 상품 준비 시작 — PAID 전이는 admin 수동 처리 (실결제 없음)</p>
              </div>
              <p className="mt-8 text-center text-[14px] text-text-primary">홈으로 돌아가기</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

/** 모바일 폼 섹션 (● 제목 + 내용) */
function FormSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-10">
      <p className="mb-5 flex items-center gap-2 text-[16px] font-bold text-text-primary">
        <span className="h-[10px] w-[10px] rounded-full bg-accent" />
        {title}
      </p>
      {children}
    </div>
  );
}

/** 모바일 라벨 입력 */
function MField({ label, ph }: { label: string; ph: string }) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-text-primary">{label}</span>
      <input
        type="text"
        placeholder={ph}
        className="mt-2 h-[48px] w-full rounded-[8px] border border-border-base bg-[#fefefe] px-[14px] text-[14px] text-text-primary placeholder:text-[#999]"
      />
    </label>
  );
}
