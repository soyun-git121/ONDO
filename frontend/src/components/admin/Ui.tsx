import type { ReactNode } from "react";
import { Link } from "react-router-dom";

/** 관리자 화면 공용 표시 요소 (헤더·배지·빈 상태·페이지네이션). */

export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold">{title}</h1>
        {description && <p className="mt-1 text-xs text-text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

type Tone = "neutral" | "positive" | "warning" | "danger";

const toneClass: Record<Tone, string> = {
  // 라임(brand)은 배경으로만 쓰고 글자는 검정 — design.md Contrast rules.
  neutral: "bg-surface-muted text-text-muted",
  positive: "bg-primary text-text-on-primary",
  warning: "bg-secondary text-text-on-primary",
  danger: "bg-error text-surface",
};

export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2 py-[2px] text-xs font-medium ${toneClass[tone]}`}
    >
      {children}
    </span>
  );
}

/** 공개/비공개처럼 이분 상태를 한눈에 보여주는 배지. */
export function PublishedBadge({ published }: { published: boolean }) {
  return <Badge tone={published ? "positive" : "neutral"}>{published ? "공개" : "비공개"}</Badge>;
}

export function EmptyRow({ message, colSpan }: { message: string; colSpan: number }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-3 py-10 text-center text-sm text-text-muted">
        {message}
      </td>
    </tr>
  );
}

/** 목록 화면 공통 테이블 셸 — thead는 호출부에서 넘긴다. */
export function Table({ head, children }: { head: ReactNode; children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-md border border-border-base bg-surface">
      <table className="w-full min-w-[720px] border-collapse text-sm">
        <thead className="border-b border-border-base bg-surface-muted text-left">{head}</thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Th({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <th className={`px-3 py-2 text-xs font-medium text-text-muted ${className}`}>{children}</th>;
}

export function Td({
  children = null,
  className = "",
}: {
  children?: ReactNode;
  className?: string;
}) {
  return <td className={`border-t border-border-base px-3 py-2 ${className}`}>{children}</td>;
}

export function Pagination({
  page,
  totalPages,
  totalElements,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalElements: number;
  onChange: (page: number) => void;
}) {
  if (totalElements === 0) return null;
  return (
    <nav className="mt-3 flex items-center justify-between text-xs" aria-label="페이지 이동">
      <span className="text-text-muted">
        총 {totalElements.toLocaleString()}건 · {page + 1} / {Math.max(totalPages, 1)} 페이지
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 0}
          className="rounded-sm border border-border-base px-3 py-1 disabled:cursor-not-allowed disabled:text-text-muted"
        >
          이전
        </button>
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page + 1 >= totalPages}
          className="rounded-sm border border-border-base px-3 py-1 disabled:cursor-not-allowed disabled:text-text-muted"
        >
          다음
        </button>
      </div>
    </nav>
  );
}

/** 목록 → 수정 화면으로 가는 링크 버튼 (테이블 안에서 사용). */
export function RowLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="font-medium underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export function ErrorNotice({ message }: { message: string }) {
  return (
    <p role="alert" className="rounded-sm bg-surface-muted px-3 py-2 text-sm text-error">
      {message}
    </p>
  );
}

/** 목록·폼 로딩 중 자리 표시. */
export function LoadingNotice() {
  return <p className="px-3 py-10 text-center text-sm text-text-muted">불러오는 중…</p>;
}
