import { useState, type FormEvent } from "react";
import { Link, useLocation } from "react-router-dom";
import { createOrder } from "../api/orders";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";
import { ApiError } from "../api/client";
import type { OrderCreateResponse } from "../types/order";

interface CartItem {
  productId: number | null;
  slug: string;
  name: string;
  price: number;
  artisanName: string;
  quantity: number;
}

interface FieldDef {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  width?: "half" | "third" | "full";
}

const ORDERER: FieldDef[] = [
  { name: "ordererName", label: "이름 (필수)", type: "text", required: true, width: "half" },
  { name: "phone", label: "연락처 (필수)", type: "tel", required: true, width: "half", placeholder: "010-0000-0000" },
  { name: "email", label: "이메일 (필수)", type: "email", required: true, placeholder: "email@example.com" },
];
const SHIPPING: FieldDef[] = [
  { name: "zipcode", label: "우편번호 (필수)", type: "text", required: true, width: "third" },
  { name: "address", label: "기본 주소 (필수)", type: "text", required: true, placeholder: "도로명 / 지번 주소" },
  { name: "addressDetail", label: "상세 주소", type: "text", required: false, placeholder: "동 / 호수 등" },
];
const ALL = [...ORDERER, ...SHIPPING];

/**
 * 주문서 → PENDING 생성 → 입금 안내 화면 (실결제 없음 — claude.md).
 * 피그마 51:2(2열 체크아웃) 반영: 좌 폼 / 우 주문 요약 카드.
 * 장바구니는 라우터 메모리 상태(location.state)로만 전달, localStorage 금지.
 */
export default function OrderPage() {
  const location = useLocation();
  const items = ((location.state as { items?: CartItem[] } | null)?.items ?? []) as CartItem[];
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState<OrderCreateResponse | null>(null);

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const nextErrors: Record<string, string> = {};
    for (const f of ALL) {
      if (f.required && !String(form.get(f.name) ?? "").trim()) {
        nextErrors[f.name] = "필수 입력 항목입니다.";
      }
    }
    if (!form.get("agree")) nextErrors.agree = "주문 내용에 동의해 주세요.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      const first = ALL.find((f) => nextErrors[f.name]);
      if (first) document.getElementById(`order-${first.name}`)?.focus();
      return;
    }

    setSubmitting(true);
    setServerError(null);
    try {
      const res = await createOrder({
        ordererName: String(form.get("ordererName")),
        phone: String(form.get("phone")),
        email: String(form.get("email")),
        zipcode: String(form.get("zipcode")),
        address: String(form.get("address")),
        addressDetail: String(form.get("addressDetail") ?? ""),
        memo: String(form.get("memo") ?? ""),
        items: items.map((i) => ({ productId: i.productId ?? 0, quantity: i.quantity })),
      });
      setDone(res);
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "주문 접수에 실패했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  // 입금 안내 화면 (주문 완료)
  if (done) {
    return (
      <main>
        <Container className="max-w-2xl py-9 text-center">
          <h1 className="font-display text-2xl font-bold leading-tight">주문이 접수되었습니다</h1>
          <p className="mt-4 text-base text-text-muted">
            주문번호 <strong className="text-text-primary">{done.orderNumber}</strong>
          </p>
          <div className="mt-7 rounded-md bg-surface-muted p-5 text-left">
            <h2 className="text-lg font-bold">입금 안내</h2>
            <p className="mt-3 text-base">
              결제 금액: <strong>{done.totalAmount.toLocaleString()}원</strong>
            </p>
            <p className="mt-2 whitespace-pre-line text-sm text-text-muted">
              입금 계좌: (계좌 정보 준비 중){"\n"}
              입금 확인 후 상품 준비가 시작됩니다 — 상태 변경은 관리자에서 수동 처리합니다.
            </p>
          </div>
          <Link to="/" className="mt-7 inline-block underline underline-offset-4">
            홈으로 돌아가기
          </Link>
        </Container>
      </main>
    );
  }

  // 장바구니 비어 있음
  if (items.length === 0) {
    return (
      <main>
        <Container className="py-9 text-center">
          <h1 className="font-display text-xl font-bold">주문할 상품이 없습니다</h1>
          <p className="mt-3 text-sm text-text-muted">
            상품 상세 페이지에서 "주문하기"를 눌러 진행해 주세요.
          </p>
          <Link to="/shop" className="mt-6 inline-block underline underline-offset-4">
            Shop 보러 가기
          </Link>
        </Container>
      </main>
    );
  }

  const inputClass = (name: string) =>
    `min-h-[44px] w-full rounded-sm border bg-surface px-3 py-3 transition-colors duration-fast focus:border-text-primary ${
      errors[name] ? "border-error" : "border-border-base"
    }`;

  const renderField = (f: FieldDef) => (
    <div
      key={f.name}
      className={`flex flex-col gap-2 ${f.width === "half" ? "sm:col-span-3" : f.width === "third" ? "sm:col-span-2" : "sm:col-span-6"}`}
    >
      <label htmlFor={`order-${f.name}`} className="text-sm font-medium">
        {f.label}
      </label>
      <input
        id={`order-${f.name}`}
        name={f.name}
        type={f.type}
        placeholder={f.placeholder}
        aria-describedby={errors[f.name] ? `order-${f.name}-error` : undefined}
        aria-invalid={errors[f.name] ? true : undefined}
        className={inputClass(f.name)}
      />
      {errors[f.name] && (
        <p id={`order-${f.name}-error`} className="text-xs text-error">
          {errors[f.name]}
        </p>
      )}
    </div>
  );

  return (
    <main>
      <Container className="py-8 lg:py-9">
        <p className="text-sm text-text-muted">/order</p>
        <h1 className="mt-1 font-display text-2xl font-bold leading-tight tracking-[-0.02em]">주문 / 결제</h1>
        <p className="mt-2 text-sm text-text-muted">STEP 1 · 주문서 작성 → STEP 2 · 입금 안내</p>

        <form onSubmit={onSubmit} noValidate className="mt-7 grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* ── 좌: 폼 ── */}
          <div className="flex flex-col gap-8">
            {/* 주문자 정보 */}
            <section>
              <h2 className="flex items-center gap-2 text-base font-bold">
                <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
                주문자 정보
              </h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-6">{ORDERER.map(renderField)}</div>
            </section>

            {/* 배송지 */}
            <section>
              <h2 className="flex items-center gap-2 text-base font-bold">
                <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
                배송지
              </h2>
              <div className="mt-4 grid items-end gap-4 sm:grid-cols-6">
                {renderField(SHIPPING[0])}
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <span className="text-sm font-medium" aria-hidden="true">
                    &nbsp;
                  </span>
                  <button
                    type="button"
                    className="min-h-[44px] rounded-sm border border-text-primary px-4 text-sm transition-colors duration-fast hover:bg-surface-muted"
                  >
                    주소 찾기
                  </button>
                </div>
                {renderField(SHIPPING[1])}
                {renderField(SHIPPING[2])}
                <div className="flex flex-col gap-2 sm:col-span-6">
                  <label htmlFor="order-memo" className="text-sm font-medium">
                    배송 메모
                  </label>
                  <textarea
                    id="order-memo"
                    name="memo"
                    rows={3}
                    placeholder="부재 시 문 앞에 놓아주세요"
                    className="w-full rounded-sm border border-border-base bg-surface px-3 py-3 focus:border-text-primary"
                  />
                </div>
              </div>
            </section>

            {/* 결제 수단 */}
            <section>
              <h2 className="flex items-center gap-2 text-base font-bold">
                <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
                결제 수단
              </h2>
              <div className="mt-4 flex items-start gap-3 rounded-sm border-2 border-text-primary p-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-4 w-4 items-center justify-center rounded-pill border-2 border-text-primary"
                >
                  <span className="h-2 w-2 rounded-pill bg-accent" />
                </span>
                <span className="flex flex-col">
                  <span className="text-sm font-bold">무통장 입금</span>
                  <span className="text-xs text-text-muted">
                    주문 후 입금 안내 화면 제공 · 실결제 없음 (Phase 4 PG 연동 전)
                  </span>
                </span>
              </div>
            </section>
          </div>

          {/* ── 우: 주문 요약 카드 ── */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-md border border-border-base bg-surface p-6">
              <h2 className="text-lg font-bold">주문 요약</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {items.map((i) => (
                  <li key={i.slug} className="flex items-baseline justify-between gap-3 text-sm">
                    <span>
                      <span className="font-medium">{i.name}</span>
                      <br />
                      <span className="text-xs text-text-muted">
                        {i.artisanName} · 수량 {i.quantity}
                      </span>
                    </span>
                    <span className="font-display font-bold">{(i.price * i.quantity).toLocaleString()}원</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-2 border-t border-border-base pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">상품 금액</span>
                  <span>{total.toLocaleString()}원</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">배송비</span>
                  <span>무료</span>
                </div>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-border-base pt-4">
                <span className="font-bold">합계</span>
                <span className="font-display text-xl font-bold">{total.toLocaleString()}원</span>
              </div>

              <label className="mt-5 flex items-start gap-2 text-sm">
                <input type="checkbox" name="agree" className="mt-1" aria-invalid={errors.agree ? true : undefined} />
                <span>주문 내용 확인 및 동의 (필수)</span>
              </label>
              {errors.agree && <p className="mt-1 text-xs text-error">{errors.agree}</p>}

              {serverError && (
                <p role="alert" className="mt-3 rounded-sm border border-error/40 px-3 py-2 text-sm text-error">
                  {serverError}
                </p>
              )}

              <Button type="submit" variant="primary" loading={submitting} className="mt-4 w-full">
                주문하기
              </Button>
              <p className="mt-3 text-center text-xs text-text-muted">
                주문 접수 후 입금 안내를 확인해 주세요 · 실결제 없음
              </p>
            </div>
          </aside>
        </form>
      </Container>
    </main>
  );
}
