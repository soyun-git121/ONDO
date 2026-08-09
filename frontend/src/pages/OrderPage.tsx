import { useState, type FormEvent, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProduct } from "../api/products";
import { createOrder } from "../api/orders";
import { useFetch } from "../hooks/useFetch";
import { won } from "../types/product";
import type { OrderCreateRequest, OrderCreateResponse } from "../types/order";
import { resolveImageUrl } from "../api/client";
import Container from "../components/layout/Container";
import Skeleton from "../components/ui/Skeleton";

/**
 * Order · Checkout(주문/결제) — Figma 51:2 "Order · Checkout / Desktop / Wireframe (blit)".
 * 구성: 좌측 폼(주문자 정보·배송지·결제 수단) + 우측 주문 요약 패널.
 *
 * 상품은 쿼리로 받는다: /order?product={slug}&qty={n} (장바구니가 없어 단건 주문).
 * 새로고침·공유에도 유지되도록 라우터 state 대신 쿼리를 쓴다.
 *
 * 제출하면 POST /api/orders로 PENDING 주문이 생성되고, 같은 화면이 입금 안내로 바뀐다.
 * 시안은 폼과 완료 화면을 한 캔버스에 나란히 그려 뒀지만 실제로는 배타적인 두 상태다.
 *
 * 금액은 서버가 재계산한다(클라이언트 금액 신뢰 안 함). 합계는 상품 금액과 같다 —
 * 백엔드에 배송비 개념이 없으므로 시안의 '배송비 3,000원'은 넣지 않는다.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

const INPUT_CLS =
  "rounded-[8px] border border-border-base bg-[#fefefe] px-[14px] text-[14px] text-text-primary outline-none placeholder:text-[#999] focus:border-text-primary disabled:opacity-60";

const EMPTY_FORM = {
  ordererName: "",
  phone: "",
  email: "",
  zipcode: "",
  address: "",
  addressDetail: "",
  memo: "",
};

type FormState = typeof EMPTY_FORM;

/** ● 제목 섹션 */
function Fieldset({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mt-10 first:mt-0">
      <p className="mb-5 flex items-center gap-2 text-[16px] font-bold text-text-primary">
        <span aria-hidden="true" className="h-[10px] w-[10px] rounded-full bg-accent" />
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({
  label,
  ph,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
}: {
  label: string;
  ph: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[13px] font-medium text-text-primary">{label}</span>
      <input
        type={type}
        required={required}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={ph}
        className={`mt-2 h-[48px] w-full ${INPUT_CLS}`}
      />
    </label>
  );
}

export default function OrderPage() {
  const [params] = useSearchParams();
  const slug = params.get("product");
  const qty = Math.max(1, Number(params.get("qty") ?? 1) || 1);

  const { data: product, loading, error } = useFetch(
    () => (slug ? getProduct(slug) : Promise.resolve(null)),
    [slug],
  );

  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [agreed, setAgreed] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);
  const [done, setDone] = useState<OrderCreateResponse | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setSending(true);
    setFailed(null);
    try {
      const body: OrderCreateRequest = {
        ...form,
        items: [{ productId: product.id, quantity: qty }],
      };
      setDone(await createOrder(body));
      window.scrollTo(0, 0);
    } catch (err) {
      setFailed(err instanceof Error ? err.message : "주문 접수에 실패했습니다.");
    } finally {
      setSending(false);
    }
  };

  /* ── 완료: 입금 안내 ── */
  if (done) {
    return (
      <main style={{ fontFamily: INTER }}>
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6 lg:px-5">
          <div className="rounded-[16px] border border-border-base bg-[#fefefe] px-4 py-12">
            <p className="text-center text-[clamp(24px,7vw,30px)] font-bold text-text-primary">
              주문이 접수되었습니다
            </p>
            <p className="mt-3 text-center text-[15px] leading-[1.6] text-text-muted">
              {`주문번호  ${done.orderNumber}`}
            </p>
            <div className="mx-auto mt-8 max-w-[840px] rounded-[12px] bg-surface-muted p-6">
              <p className="text-[16px] font-bold text-text-primary">입금 안내</p>
              <p className="mt-3 text-[15px] leading-[1.6] text-text-primary">
                {`결제 금액  ${won(done.totalAmount)}`}
              </p>
              <p className="mt-1 text-[14px] text-text-muted">{"입금 계좌  (정보 준비 중)"}</p>
              <p className="mt-1 text-[13px] text-[#999]">
                입금 확인 후 상품 준비 시작 — PAID 전이는 admin 수동 처리 (실결제 없음)
              </p>
            </div>
            <p className="mt-4 text-center text-[13px] text-[#999]">
              주문번호와 연락처로 주문을 조회할 수 있으니 주문번호를 저장해 두세요.
            </p>
            <p className="mt-8 text-center">
              <Link to="/" className="text-[14px] text-text-primary underline underline-offset-4">
                홈으로 돌아가기
              </Link>
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main>
        <Container className="py-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="mt-8 h-64 w-full" />
        </Container>
      </main>
    );
  }

  /* ── 주문할 상품이 없거나 불러오지 못한 경우 ── */
  if (!slug || error || !product) {
    return (
      <main style={{ fontFamily: INTER }}>
        <Container className="py-9 text-center">
          <h1 className="text-[22px] font-bold text-text-primary">주문할 상품이 없습니다</h1>
          <p className="mt-3 text-[14px] text-text-muted">
            {error ?? "Shop에서 상품을 고른 뒤 '주문하기'를 눌러 주세요."}
          </p>
          <Link to="/shop" className="mt-6 inline-block text-[14px] underline underline-offset-4">
            Shop으로 가기
          </Link>
        </Container>
      </main>
    );
  }

  /* ── 주문할 수 없는 상태(문의 전용·품절)는 서버도 거절하므로 미리 막는다 ── */
  if (product.status !== "ON_SALE") {
    return (
      <main style={{ fontFamily: INTER }}>
        <Container className="py-9 text-center">
          <h1 className="text-[22px] font-bold text-text-primary">
            지금은 주문할 수 없는 상품입니다
          </h1>
          <p className="mt-3 text-[14px] text-text-muted">
            {product.status === "INQUIRY_ONLY"
              ? "건별로 협의하는 상품입니다. 협업문의로 연락 주세요."
              : "품절된 상품입니다."}
          </p>
          <Link
            to={product.status === "INQUIRY_ONLY" ? "/collaboration" : `/shop/${product.slug}`}
            className="mt-6 inline-block text-[14px] underline underline-offset-4"
          >
            {product.status === "INQUIRY_ONLY" ? "협업 문의하기" : "상품으로 돌아가기"}
          </Link>
        </Container>
      </main>
    );
  }

  const lineAmount = product.price * qty;

  return (
    <main style={{ fontFamily: INTER }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6 lg:px-5">
        <h1 className="text-[clamp(32px,8vw,46px)] font-bold text-text-primary">주문 / 결제</h1>

        <form
          onSubmit={submit}
          className="mt-8 grid grid-cols-1 gap-10 xl:grid-cols-[740px_480px] xl:gap-x-[60px]"
        >
          {/* ── 좌: 입력 ── */}
          <div>
            <Fieldset title="주문자 정보">
              <div className="grid grid-cols-1 gap-x-[24px] gap-y-5 sm:grid-cols-2">
                <Field
                  label="이름 (필수)"
                  ph="이름"
                  required
                  disabled={sending}
                  value={form.ordererName}
                  onChange={(v) => set("ordererName", v)}
                />
                <Field
                  label="연락처 (필수)"
                  ph="010-0000-0000"
                  type="tel"
                  required
                  disabled={sending}
                  value={form.phone}
                  onChange={(v) => set("phone", v)}
                />
                <div className="sm:col-span-2">
                  <Field
                    label="이메일 (필수)"
                    ph="email@example.com"
                    type="email"
                    required
                    disabled={sending}
                    value={form.email}
                    onChange={(v) => set("email", v)}
                  />
                </div>
              </div>
            </Fieldset>

            <Fieldset title="배송지">
              <div className="w-[200px] max-w-[55%]">
                <Field
                  label="우편번호 (필수)"
                  ph="우편번호"
                  required
                  disabled={sending}
                  value={form.zipcode}
                  onChange={(v) => set("zipcode", v)}
                />
              </div>
              <div className="mt-5">
                <Field
                  label="기본 주소 (필수)"
                  ph="도로명 / 지번 주소"
                  required
                  disabled={sending}
                  value={form.address}
                  onChange={(v) => set("address", v)}
                />
              </div>
              <div className="mt-5">
                <Field
                  label="상세 주소"
                  ph="동 / 호수 등"
                  disabled={sending}
                  value={form.addressDetail}
                  onChange={(v) => set("addressDetail", v)}
                />
              </div>
              <label className="mt-5 block">
                <span className="text-[13px] font-medium text-text-primary">배송 메모</span>
                <textarea
                  rows={2}
                  disabled={sending}
                  value={form.memo}
                  onChange={(e) => set("memo", e.target.value)}
                  placeholder="부재 시 문 앞에 놓아주세요"
                  className={`mt-2 w-full py-[14px] ${INPUT_CLS}`}
                />
              </label>
            </Fieldset>

            <Fieldset title="결제 수단">
              <div className="flex items-start gap-3 rounded-[8px] border-[1.5px] border-text-primary bg-[#fefefe] p-4">
                <span className="mt-0.5 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border border-text-primary">
                  <span className="h-[8px] w-[8px] rounded-full bg-text-primary" />
                </span>
                <div>
                  <p className="text-[15px] font-bold text-text-primary">무통장 입금</p>
                  <p className="mt-1 text-[13px] text-text-muted">
                    주문 후 입금 안내 화면 제공 · 실결제 없음 (Phase 4 PG 연동 전)
                  </p>
                </div>
              </div>
              <div className="mt-4 flex h-[56px] items-center rounded-[8px] border border-border-base bg-surface-muted px-[22px] text-[14px] text-[#999]">
                카드 결제 · 간편결제 — 준비 중
              </div>
            </Fieldset>
          </div>

          {/* ── 우: 주문 요약 ── */}
          <div className="rounded-[16px] border border-border-base bg-[#fefefe] p-6 xl:sticky xl:top-24 xl:self-start">
            <p className="text-[20px] font-bold text-text-primary">주문 요약</p>

            <div className="mt-4 flex gap-4">
              {product.thumbnailUrl ? (
                <img
                  src={resolveImageUrl(product.thumbnailUrl)}
                  alt=""
                  className="h-[64px] w-[64px] shrink-0 rounded-[8px] bg-surface-muted object-cover"
                />
              ) : (
                <div className="h-[64px] w-[64px] shrink-0 rounded-[8px] bg-surface-muted" />
              )}
              <div className="min-w-0 flex-1">
                <Link
                  to={`/shop/${product.slug}`}
                  className="text-[15px] font-medium text-text-primary underline-offset-4 hover:underline"
                >
                  {product.name}
                </Link>
                <p className="mt-1 text-[12px] text-[#999]">
                  {`${product.artisan.name} · ${product.artisan.title}`}
                </p>
                <p className="mt-1 text-[13px] text-text-muted">{`수량 ${qty}`}</p>
              </div>
              <p className="whitespace-nowrap text-[14px] font-bold text-text-primary">
                {won(lineAmount)}
              </p>
            </div>

            <div className="my-5 border-t border-border-base" />
            <div className="flex justify-between py-1 text-[14px]">
              <span className="text-text-muted">상품 금액</span>
              <span className="text-text-primary">{won(lineAmount)}</span>
            </div>
            <div className="flex justify-between py-1 text-[14px]">
              <span className="text-text-muted">배송비</span>
              {/* 배송비는 아직 정책·계산이 없다. 임의 금액을 표시하면 실제 청구액과 어긋난다. */}
              <span className="text-text-primary">주문 확인 후 안내</span>
            </div>

            <div className="my-5 border-t border-border-base" />
            <div className="flex items-center justify-between">
              <span className="text-[16px] font-bold text-text-primary">합계</span>
              <span className="text-[22px] font-bold text-text-primary">{won(lineAmount)}</span>
            </div>

            <label className="mt-5 flex items-center gap-2">
              <input
                type="checkbox"
                required
                disabled={sending}
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="h-[18px] w-[18px] rounded-[4px] border border-text-primary accent-primary"
              />
              <span className="text-[13px] text-text-primary">주문 내용 확인 및 동의 (필수)</span>
            </label>

            <button
              type="submit"
              disabled={sending}
              className="mt-4 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary disabled:opacity-60"
            >
              {sending ? "접수 중…" : "주문하기"}
            </button>

            {failed && (
              <p role="status" className="mt-4 text-center text-[14px] text-error">
                {failed}
              </p>
            )}

            <p className="mt-4 text-center text-[12px] text-[#999]">
              주문 접수 후 입금 안내를 확인해 주세요 · 실결제 없음
            </p>
          </div>
        </form>
      </div>
    </main>
  );
}
