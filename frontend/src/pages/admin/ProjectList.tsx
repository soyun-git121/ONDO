import { useState } from "react";
import { Link } from "react-router-dom";
import { adminProjects } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { ConfirmDialog, useToast } from "../../components/admin/Feedback";
import {
  Badge,
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
import { PROJECT_TYPE_LABEL } from "../../types/project";

export default function ProjectList() {
  const [page, setPage] = useState(0);
  const [target, setTarget] = useState<{ id: number; title: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const toast = useToast();

  const { data, loading, error, reload } = useAdminData(
    () => adminProjects.list({ page, size: 20 }),
    [page],
  );

  const remove = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await adminProjects.remove(target.id);
      toast.success("실적을 삭제했습니다.");
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
        title="협업 실적"
        description="공개된 실적은 Project 목록에 나옵니다. 홈·협업문의에 띄울 실적은 등록 화면의 '노출'에서 따로 고릅니다."
        actions={
          <Link
            to="/admin/projects/new"
            className="rounded-pill bg-primary px-4 py-2 text-sm font-medium text-text-on-primary"
          >
            실적 등록
          </Link>
        }
      />

      {error && <ErrorNotice message={error} />}

      <Table
        head={
          <tr>
            <Th>제목</Th>
            <Th>유형</Th>
            <Th>협업사</Th>
            <Th>일자</Th>
            <Th>노출 위치</Th>
            <Th>공개</Th>
            <Th className="text-right">관리</Th>
          </tr>
        }
      >
        {loading ? (
          <EmptyRow message="불러오는 중…" colSpan={7} />
        ) : !data || data.content.length === 0 ? (
          <EmptyRow message="등록된 실적이 없습니다." colSpan={7} />
        ) : (
          data.content.map((p) => (
            <tr key={p.id}>
              <Td>
                <RowLink to={`/admin/projects/${p.id}`}>{p.title}</RowLink>
              </Td>
              <Td>
                <Badge>{PROJECT_TYPE_LABEL[p.type]}</Badge>
              </Td>
              <Td className="text-text-muted">{p.clientName ?? "—"}</Td>
              <Td className="text-text-muted">{p.projectDate}</Td>
              <Td>
                {/* 둘 다 꺼져 있으면 Project 목록에만 나온다는 뜻 — 빈칸 대신 명시한다. */}
                {p.showOnHome || p.showOnCollaboration ? (
                  <span className="flex flex-wrap gap-1">
                    {p.showOnHome && <Badge tone="warning">홈</Badge>}
                    {p.showOnCollaboration && <Badge tone="warning">협업문의</Badge>}
                  </span>
                ) : (
                  <span className="text-text-muted">목록만</span>
                )}
              </Td>
              <Td>
                <PublishedBadge published={p.published} />
              </Td>
              <Td className="text-right">
                <button
                  type="button"
                  onClick={() => setTarget({ id: p.id, title: p.title })}
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
        title="이 실적을 삭제할까요?"
        description={target?.title}
        onConfirm={remove}
        onCancel={() => setTarget(null)}
        busy={busy}
      />
    </>
  );
}
