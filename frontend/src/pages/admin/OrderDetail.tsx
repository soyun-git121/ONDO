import { useState } from "react";
import type { ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { adminOrders } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { ConfirmDialog, useToast } from "../../components/admin/Feedback";
import {
  Badge,
  ErrorNotice,
  LoadingNotice,
  PageHeader,
  Table,
  Td,
  Th,
} from "../../components/admin/Ui";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "../../types/order";
import type { OrderStatus } from "../../types/order";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-border-base py-2 last:border-0">
      <dt className="w-24 shrink-0 text-xs text-text-muted">{label}</dt>
      <dd className="text-sm">{children}</dd>
    </div>
  );
}

export default function OrderDetail() {
  const { id } = useParams();
  const toast = useToast();
  const [pending, setPending] = useState<OrderStatus | null>(null);
  const [busy, setBusy] = useState(false);

  const { data, loading, error, reload } = useAdminData(
    () => adminOrders.get(Number(id)),
    [id],
  );

  const apply = async () => {
    if (!pending || !data) return;
    setBusy(true);
    try {
      await adminOrders.changeStatus(data.id, pending);
      toast.success(`'${ORDER_STATUS_LABEL[pending]}'(으)로 변경했습니다.`);
      setPending(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "변경에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <LoadingNotice />;
  if (error) return <ErrorNotice message={error} />;
  if (!data) return null;

  // 서버가 계산해 준 허용 전이만 버튼으로 노출한다 — 불가능한 조작을 눌러보게 두지 않는다.
  const nextStates = data.allowedNextStatuses;

  return (
    <>
      <PageHeader
        title={`주문 ${data.orderNumber}`}
        description={`${data.createdAt.slice(0, 16).replace("T", " ")} 접수`}
        actions={
          <Link to="/admin/orders" className="text-xs text-text-muted underline-offset-4 hover:underline">
            목록으로
          </Link>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-2 rounded-md border border-border-base bg-surface p-3">
        <span className="text-xs text-text-muted">현재 상태</span>
        <Badge tone={ORDER_STATUS_TONE[data.status]}>{ORDER_STATUS_LABEL[data.status]}</Badge>
        {nextStates.length === 0 ? (
          <span className="text-xs text-text-muted">더 이상 변경할 수 없는 상태입니다.</span>
        ) : (
          <>
            <span className="ml-2 text-xs text-text-muted">변경:</span>
            {nextStates.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setPending(s)}
                className={`rounded-pill px-3 py-1 text-xs font-medium ${
                  s === "CANCELLED"
                    ? "border border-error text-error"
                    : "bg-primary text-text-on-primary"
                }`}
              >
                {ORDER_STATUS_LABEL[s]}
              </button>
            ))}
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <section className="rounded-md border border-border-base bg-surface p-4">
          <h2 className="mb-2 text-sm font-semibold">주문자</h2>
          <dl>
            <Row label="이름">{data.ordererName}</Row>
            <Row label="연락처">{data.phone}</Row>
            <Row label="이메일">{data.email ?? "—"}</Row>
          </dl>
        </section>

        <section className="rounded-md border border-border-base bg-surface p-4">
          <h2 className="mb-2 text-sm font-semibold">배송지</h2>
          <dl>
            <Row label="우편번호">{data.zipcode}</Row>
            <Row label="주소">
              {data.address}
              {data.addressDetail ? ` ${data.addressDetail}` : ""}
            </Row>
            <Row label="요청사항">{data.memo ?? "—"}</Row>
          </dl>
        </section>
      </div>

      <h2 className="mb-2 mt-4 text-sm font-semibold">주문 상품</h2>
      <Table
        head={
          <tr>
            <Th>상품명</Th>
            <Th>보유자</Th>
            <Th className="text-right">단가</Th>
            <Th className="text-right">수량</Th>
            <Th className="text-right">금액</Th>
          </tr>
        }
      >
        {data.items.map((item, i) => (
          <tr key={i}>
            <Td>
              {item.productName}
              {item.productId === null && (
                <span className="ml-2 text-xs text-text-muted">(삭제된 상품)</span>
              )}
            </Td>
            <Td className="text-text-muted">{item.artisanName}</Td>
            <Td className="text-right">{item.price.toLocaleString()}원</Td>
            <Td className="text-right">{item.quantity}</Td>
            <Td className="text-right">{(item.price * item.quantity).toLocaleString()}원</Td>
          </tr>
        ))}
        <tr>
          <Td className="font-medium" />
          <Td />
          <Td />
          <Td className="text-right text-xs text-text-muted">합계</Td>
          <Td className="text-right font-semibold">{data.totalAmount.toLocaleString()}원</Td>
        </tr>
      </Table>

      <p className="mt-2 text-xs text-text-muted">
        상품명·보유자·단가는 주문 시점 스냅샷입니다 — 이후 상품이 바뀌어도 정산 근거로 남습니다.
      </p>

      <ConfirmDialog
        open={pending !== null}
        title={`'${pending ? ORDER_STATUS_LABEL[pending] : ""}'(으)로 변경할까요?`}
        description={
          pending === "CANCELLED"
            ? "취소하면 주문 상품의 재고가 자동으로 복원됩니다. 되돌릴 수 없습니다."
            : "상태 변경은 되돌릴 수 없습니다."
        }
        confirmLabel="변경"
        onConfirm={apply}
        onCancel={() => setPending(null)}
        busy={busy}
      />
    </>
  );
}
