import { useState } from "react";
import { Link } from "react-router-dom";
import { adminProducts } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { ConfirmDialog, useToast } from "../../components/admin/Feedback";
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
import { PRODUCT_CATEGORY_LABEL, PRODUCT_STATUS_LABEL } from "../../types/product";
import type { ProductStatus } from "../../types/product";

export default function ProductList() {
  const [page, setPage] = useState(0);
  const [target, setTarget] = useState<{ id: number; name: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const { data, loading, error, reload } = useAdminData(
    () => adminProducts.list({ page, size: 20 }),
    [page],
  );

  const changeStatus = async (id: number, status: ProductStatus) => {
    try {
      await adminProducts.changeStatus(id, status);
      toast.success("판매 상태를 변경했습니다.");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "변경에 실패했습니다.");
    }
  };

  const remove = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await adminProducts.remove(target.id);
      toast.success(`${target.name}을(를) 삭제했습니다.`);
      setTarget(null);
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "삭제에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="상품"
        description="판매 상태는 목록에서 바로 바꿀 수 있습니다."
        actions={
          <Link
            to="/admin/products/new"
            className="rounded-pill bg-primary px-4 py-2 text-sm font-medium text-text-on-primary"
          >
            상품 등록
          </Link>
        }
      />

      {error && <ErrorNotice message={error} />}

      <Table
        head={
          <tr>
            <Th>상품명</Th>
            <Th>보유자</Th>
            <Th>분류</Th>
            <Th className="text-right">가격</Th>
            <Th className="text-right">재고</Th>
            <Th>판매 상태</Th>
            <Th className="text-right">관리</Th>
          </tr>
        }
      >
        {loading ? (
          <EmptyRow message="불러오는 중…" colSpan={7} />
        ) : !data || data.content.length === 0 ? (
          <EmptyRow message="등록된 상품이 없습니다." colSpan={7} />
        ) : (
          data.content.map((p) => (
            <tr key={p.id}>
              <Td>
                <RowLink to={`/admin/products/${p.id}`}>{p.name}</RowLink>
                <span className="ml-2 font-mono text-xs text-text-muted">{p.slug}</span>
              </Td>
              <Td className="text-text-muted">{p.artisanName}</Td>
              <Td>
                <Badge>{PRODUCT_CATEGORY_LABEL[p.category]}</Badge>
              </Td>
              <Td className="text-right">{p.price.toLocaleString()}원</Td>
              <Td className="text-right">{p.stockQuantity}</Td>
              <Td>
                <Select
                  aria-label={`${p.name} 판매 상태`}
                  value={p.status}
                  onChange={(e) => changeStatus(p.id, e.target.value as ProductStatus)}
                  className="max-w-[130px] py-1 text-xs"
                >
                  {(Object.keys(PRODUCT_STATUS_LABEL) as ProductStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {PRODUCT_STATUS_LABEL[s]}
                    </option>
                  ))}
                </Select>
              </Td>
              <Td className="text-right">
                <button
                  type="button"
                  onClick={() => setTarget({ id: p.id, name: p.name })}
                  className="text-xs text-error underline-offset-4 hover:underline"
                >
                  삭제
                </button>
              </Td>
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

      <ConfirmDialog
        open={target !== null}
        title={`${target?.name ?? ""}을(를) 삭제할까요?`}
        description="주문 기록은 스냅샷으로 남지만 상품 정보는 되돌릴 수 없습니다."
        onConfirm={remove}
        onCancel={() => setTarget(null)}
        busy={busy}
      />
    </>
  );
}
