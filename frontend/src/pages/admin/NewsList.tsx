import { useState } from "react";
import { Link } from "react-router-dom";
import { adminNews } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { ConfirmDialog, useToast } from "../../components/admin/Feedback";
import { Input } from "../../components/admin/Form";
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
import { NEWS_CATEGORY_LABEL } from "../../types/news";

const TYPE_LABEL = { ORIGINAL: "자체 작성", CURATED: "외부 링크" } as const;

function formatDate(value: string | null) {
  if (!value) return "—";
  return value.slice(0, 10);
}

export default function NewsList() {
  const [page, setPage] = useState(0);
  const [target, setTarget] = useState<{ id: number; title: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("전통문화");
  const [importing, setImporting] = useState(false);
  const toast = useToast();

  const { data, loading, error, reload } = useAdminData(
    () => adminNews.list({ page, size: 20 }),
    [page],
  );

  const togglePublish = async (id: number, published: boolean) => {
    try {
      await adminNews.setPublish(id, published);
      toast.success(published ? "공개로 전환했습니다." : "비공개로 전환했습니다.");
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "변경에 실패했습니다.");
    }
  };

  const runImport = async () => {
    setImporting(true);
    try {
      const count = await adminNews.importFromNaver(query, 10);
      toast.success(
        count > 0 ? `${count}건을 가져왔습니다.` : "새로 가져올 기사가 없습니다.",
      );
      reload();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "가져오기에 실패했습니다.");
    } finally {
      setImporting(false);
    }
  };

  const remove = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await adminNews.remove(target.id);
      toast.success("뉴스를 삭제했습니다.");
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
        title="뉴스"
        description="가져온 기사는 비공개 상태로 저장됩니다 — 확인 후 공개로 전환하세요."
        actions={
          <Link
            to="/admin/news/new"
            className="rounded-pill bg-primary px-4 py-2 text-sm font-medium text-text-on-primary"
          >
            뉴스 작성
          </Link>
        }
      />

      <div className="mb-3 flex flex-wrap items-end gap-2 rounded-md border border-border-base bg-surface p-3">
        <label className="flex flex-col gap-1">
          <span className="text-xs font-medium">네이버 뉴스 검색어</span>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-[200px]"
          />
        </label>
        <button
          type="button"
          onClick={runImport}
          disabled={importing || query.trim() === ""}
          className="rounded-sm border border-border-base px-3 py-2 text-sm disabled:text-text-muted"
        >
          {importing ? "가져오는 중…" : "기사 가져오기"}
        </button>
        <p className="text-xs text-text-muted">
          이미 등록된 링크는 건너뜁니다. 네이버 API 키가 없으면 실패합니다.
        </p>
      </div>

      {error && <ErrorNotice message={error} />}

      <Table
        head={
          <tr>
            <Th>제목</Th>
            <Th>유형</Th>
            <Th>분류</Th>
            <Th>발행일</Th>
            <Th>공개</Th>
            <Th className="text-right">관리</Th>
          </tr>
        }
      >
        {loading ? (
          <EmptyRow message="불러오는 중…" colSpan={6} />
        ) : !data || data.content.length === 0 ? (
          <EmptyRow message="등록된 뉴스가 없습니다." colSpan={6} />
        ) : (
          data.content.map((n) => (
            <tr key={n.id}>
              <Td>
                <RowLink to={`/admin/news/${n.id}`}>{n.title}</RowLink>
              </Td>
              <Td className="text-text-muted">{TYPE_LABEL[n.type]}</Td>
              <Td>
                <Badge>{NEWS_CATEGORY_LABEL[n.category]}</Badge>
              </Td>
              <Td className="text-text-muted">{formatDate(n.publishedAt)}</Td>
              <Td>
                <PublishedBadge published={n.published} />
              </Td>
              <Td className="text-right">
                <button
                  type="button"
                  onClick={() => togglePublish(n.id, !n.published)}
                  className="mr-3 text-xs underline-offset-4 hover:underline"
                >
                  {n.published ? "비공개로" : "공개로"}
                </button>
                <button
                  type="button"
                  onClick={() => setTarget({ id: n.id, title: n.title })}
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
        title="이 뉴스를 삭제할까요?"
        description={target?.title}
        onConfirm={remove}
        onCancel={() => setTarget(null)}
        busy={busy}
      />
    </>
  );
}
