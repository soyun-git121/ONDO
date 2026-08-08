import { useState } from "react";
import { adminInquiries } from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { useToast } from "../../components/admin/Feedback";
import { Select, Textarea } from "../../components/admin/Form";
import {
  Badge,
  EmptyRow,
  ErrorNotice,
  PageHeader,
  Pagination,
  Table,
  Td,
  Th,
} from "../../components/admin/Ui";
import { INQUIRY_STATUS_LABEL } from "../../types/admin";
import type { AdminInquiryResponse, InquiryStatus } from "../../types/admin";
import { INQUIRY_TYPE_LABEL } from "../../types/inquiry";
import type { InquiryType } from "../../types/inquiry";

const STATUS_TONE: Record<InquiryStatus, "positive" | "neutral" | "warning"> = {
  NEW: "positive",
  IN_REVIEW: "warning",
  REPLIED: "neutral",
  CLOSED: "neutral",
};

/** 펼쳐진 행 — 문의 전문과 처리 상태를 목록 안에서 바로 다룬다. */
function DetailRow({
  inquiry,
  onSaved,
}: {
  inquiry: AdminInquiryResponse;
  onSaved: () => void;
}) {
  const toast = useToast();
  const [status, setStatus] = useState<InquiryStatus>(inquiry.status);
  const [note, setNote] = useState(inquiry.adminNote ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      await adminInquiries.update(inquiry.id, { status, adminNote: note || null });
      toast.success("문의를 저장했습니다.");
      onSaved();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "저장에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <tr id={`inquiry-${inquiry.id}-detail`}>
      <td colSpan={7} className="border-t border-border-base bg-surface-muted px-3 py-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <h3 className="text-xs font-medium text-text-muted">문의 내용</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm">{inquiry.message}</p>
            <dl className="mt-3 space-y-1 text-xs text-text-muted">
              <div>
                <dt className="inline font-medium">이메일: </dt>
                <dd className="inline">
                  <a href={`mailto:${inquiry.email}`} className="underline underline-offset-4">
                    {inquiry.email}
                  </a>
                </dd>
              </div>
              {inquiry.phone && (
                <div>
                  <dt className="inline font-medium">연락처: </dt>
                  <dd className="inline">{inquiry.phone}</dd>
                </div>
              )}
            </dl>
          </div>
          <div className="flex flex-col gap-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">처리 상태</span>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as InquiryStatus)}
                className="max-w-[180px] bg-surface"
              >
                {(Object.keys(INQUIRY_STATUS_LABEL) as InquiryStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {INQUIRY_STATUS_LABEL[s]}
                  </option>
                ))}
              </Select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-xs font-medium">내부 메모</span>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="처리 이력·담당자 등 (공개되지 않습니다)"
                className="bg-surface"
              />
            </label>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="self-start rounded-pill bg-primary px-4 py-2 text-sm font-medium text-text-on-primary disabled:bg-surface-muted disabled:text-text-muted"
            >
              {saving ? "저장 중…" : "저장"}
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default function InquiryList() {
  const [page, setPage] = useState(0);
  const [status, setStatus] = useState<InquiryStatus | "">("");
  const [type, setType] = useState<InquiryType | "">("");
  const [openId, setOpenId] = useState<number | null>(null);

  const { data, loading, error, reload } = useAdminData(
    () =>
      adminInquiries.list({
        page,
        size: 20,
        status: status || undefined,
        type: type || undefined,
      }),
    [page, status, type],
  );

  return (
    <>
      <PageHeader
        title="문의"
        description="행을 누르면 문의 전문과 처리 상태가 펼쳐집니다."
      />

      <div className="mb-3 flex flex-wrap gap-2">
        <Select
          aria-label="처리 상태 필터"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as InquiryStatus | "");
            setPage(0);
          }}
          className="max-w-[160px]"
        >
          <option value="">전체 상태</option>
          {(Object.keys(INQUIRY_STATUS_LABEL) as InquiryStatus[]).map((s) => (
            <option key={s} value={s}>
              {INQUIRY_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
        <Select
          aria-label="문의 유형 필터"
          value={type}
          onChange={(e) => {
            setType(e.target.value as InquiryType | "");
            setPage(0);
          }}
          className="max-w-[160px]"
        >
          <option value="">전체 유형</option>
          {(Object.keys(INQUIRY_TYPE_LABEL) as InquiryType[]).map((t) => (
            <option key={t} value={t}>
              {INQUIRY_TYPE_LABEL[t]}
            </option>
          ))}
        </Select>
      </div>

      {error && <ErrorNotice message={error} />}

      <Table
        head={
          <tr>
            <Th>접수일</Th>
            <Th>유형</Th>
            <Th>회사</Th>
            <Th>담당자</Th>
            <Th>이메일</Th>
            <Th>상태</Th>
            <Th className="text-right">메모</Th>
          </tr>
        }
      >
        {loading ? (
          <EmptyRow message="불러오는 중…" colSpan={7} />
        ) : !data || data.content.length === 0 ? (
          <EmptyRow message="문의가 없습니다." colSpan={7} />
        ) : (
          data.content.flatMap((q) => {
            const rows = [
              <tr
                key={q.id}
                onClick={() => setOpenId(openId === q.id ? null : q.id)}
                className="cursor-pointer hover:bg-surface-muted"
              >
                <Td>
                  {/* 행 전체가 클릭 대상이지만, 키보드로도 펼칠 수 있게 실제 버튼을 둔다.
                      버튼 클릭이 행으로 전파되면 두 번 토글되므로 전파를 막는다. */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenId(openId === q.id ? null : q.id);
                    }}
                    aria-expanded={openId === q.id}
                    aria-controls={`inquiry-${q.id}-detail`}
                    className="flex items-center gap-1 text-text-muted underline-offset-4 hover:underline"
                  >
                    <span aria-hidden="true">{openId === q.id ? "▾" : "▸"}</span>
                    {q.createdAt.slice(0, 10)}
                    <span className="sr-only">
                      {openId === q.id ? "문의 상세 접기" : "문의 상세 펼치기"}
                    </span>
                  </button>
                </Td>
                <Td>
                  <Badge>{INQUIRY_TYPE_LABEL[q.type]}</Badge>
                </Td>
                <Td>{q.companyName ?? "—"}</Td>
                <Td>{q.contactName}</Td>
                <Td className="text-text-muted">{q.email}</Td>
                <Td>
                  <Badge tone={STATUS_TONE[q.status]}>{INQUIRY_STATUS_LABEL[q.status]}</Badge>
                </Td>
                <Td className="text-right text-xs text-text-muted">
                  {q.adminNote ? "있음" : "—"}
                </Td>
              </tr>,
            ];
            if (openId === q.id) {
              rows.push(<DetailRow key={`${q.id}-detail`} inquiry={q} onSaved={reload} />);
            }
            return rows;
          })
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
