import { useState } from "react";
import { adminOrders } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { Select } from "../../components/admin/Form";
import {
  Badge,
  EmptyRow,
  ErrorNotice,
  PageHeader,
  Pagination,
  RowLink,
  Table,
  Td,
  Th,
} from "../../components/admin/Ui";
import { ORDER_STATUS_LABEL, ORDER_STATUS_TONE } from "../../types/order";
import type { OrderStatus } from "../../types/order";

export default function OrderList() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<OrderStatus | "">("");

  const { data, loading, error } = useAdminData(
    () => adminOrders.list({ page, size: 20, status: status || undefined }),
    [page, status],
  );

  return (
    <>
      <PageHeader
        title="주문"
        description="입금 확인은 주문 상세에서 '결제 완료'로 전환해 처리합니다."
      />

      <div className="mb-3">
        <Select
          aria-label="주문 상태 필터"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as OrderStatus | "");
            setPage(0);
          }}
          className="max-w-[180px]"
        >
          <option value="">전체 상태</option>
          {(Object.keys(ORDER_STATUS_LABEL) as OrderStatus[]).map((s) => (
            <option key={s} value={s}>
              {ORDER_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
      </div>

      {error && <ErrorNotice message={error} />}

      <Table
        head={
          <tr>
            <Th>주문번호</Th>
            <Th>주문자</Th>
            <Th>연락처</Th>
            <Th className="text-right">금액</Th>
            <Th>상태</Th>
            <Th>주문일</Th>
          </tr>
        }
      >
        {loading ? (
          <EmptyRow message="불러오는 중…" colSpan={6} />
        ) : !data || data.content.length === 0 ? (
          <EmptyRow message="주문이 없습니다." colSpan={6} />
        ) : (
          data.content.map((o) => (
            <tr key={o.id}>
              <Td>
                <RowLink to={`/admin/orders/${o.id}`}>
                  <span className="font-mono text-xs">{o.orderNumber}</span>
                </RowLink>
              </Td>
              <Td>{o.ordererName}</Td>
              <Td className="text-text-muted">{o.phone}</Td>
              <Td className="text-right">{o.totalAmount.toLocaleString()}원</Td>
              <Td>
                <Badge tone={ORDER_STATUS_TONE[o.status]}>{ORDER_STATUS_LABEL[o.status]}</Badge>
              </Td>
              <Td className="text-text-muted">{o.createdAt.slice(0, 10)}</Td>
            </tr>
          ))
        )}
      </Table>

      {data && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          totalElements={data.totalElements}
          onChange={setPage}
        />
      )}
    </>
  );
}
