import { useState } from "react";
import { Link } from "react-router-dom";
import { adminArtisans } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { useToast, ConfirmDialog } from "../../components/admin/Feedback";
import {
  EmptyRow,
  ErrorNotice,
  PageHeader,
  Pagination,
  PublishedBadge,
  RowLink,
  Table,
  Td,
  Th,
} from "../../components/admin/Ui";
import { DESIGNATION_LABEL } from "../../types/artisan";

export default function ArtisanList() {
  const [page, setPage] = useState(0);
  const [target, setTarget] = useState<{ id: number; name: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const { data, loading, error, reload } = useAdminData(
    () => adminArtisans.list({ page, size: 20 }),
    [page],
  );

  const remove = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await adminArtisans.remove(target.id);
      toast.success(`${target.name} 보유자를 삭제했습니다.`);
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
        title="보유자"
        description="보유자를 등록하면 공개 사이트의 보유자 목록·랜딩에 노출됩니다."
        actions={
          <Link
            to="/admin/artisans/new"
            className="rounded-pill bg-primary px-4 py-2 text-sm font-medium text-text-on-primary"
          >
            보유자 등록
          </Link>
        }
      />

      {error && <ErrorNotice message={error} />}

      <Table
        head={
          <tr>
            <Th>이름</Th>
            <Th>종목</Th>
            <Th>지정 구분</Th>
            <Th>slug</Th>
            <Th className="text-right">정렬</Th>
            <Th>공개</Th>
            <Th className="text-right">관리</Th>
          </tr>
        }
      >
        {loading ? (
          <EmptyRow message="불러오는 중…" colSpan={7} />
        ) : !data || data.content.length === 0 ? (
          <EmptyRow message="등록된 보유자가 없습니다." colSpan={7} />
        ) : (
          data.content.map((a) => (
            <tr key={a.id}>
              <Td>
                <RowLink to={`/admin/artisans/${a.id}`}>{a.name}</RowLink>
              </Td>
              <Td>{a.title}</Td>
              <Td className="text-text-muted">{DESIGNATION_LABEL[a.designation]}</Td>
              <Td className="font-mono text-xs text-text-muted">{a.slug}</Td>
              <Td className="text-right">{a.displayOrder}</Td>
              <Td>
                <PublishedBadge published={a.published} />
              </Td>
              <Td className="text-right">
                <button
                  type="button"
                  onClick={() => setTarget({ id: a.id, name: a.name })}
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
        title={`${target?.name ?? ""} 보유자를 삭제할까요?`}
        description="이 보유자에 속한 상품이 있으면 삭제되지 않습니다. 되돌릴 수 없습니다."
        onConfirm={remove}
        onCancel={() => setTarget(null)}
        busy={busy}
      />
    </>
  );
}
