import type { FormEvent, ReactNode } from "react";
import { Link } from "react-router-dom";
import { Input } from "./Form";

/** 등록·수정 폼 공통 껍데기 — 제출/취소 버튼과 에러 표시를 한곳에 모은다. */
export function FormShell({
  onSubmit,
  backTo,
  submitLabel,
  saving,
  error,
  children,
}: {
  onSubmit: (e: FormEvent) => void;
  backTo: string;
  submitLabel: string;
  saving: boolean;
  error: string | null;
  children: ReactNode;
}) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 pb-20">
      {children}

      {error && (
        <p role="alert" className="rounded-sm bg-surface-muted px-3 py-2 text-sm text-error">
          {error}
        </p>
      )}

      {/* 폼이 길어서 하단 고정 — 스크롤 위치와 무관하게 저장할 수 있어야 한다. */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex justify-end gap-2 border-t border-border-base bg-surface px-4 py-3">
        <Link
          to={backTo}
          className="rounded-pill border border-border-base px-4 py-2 text-sm"
        >
          취소
        </Link>
        <button
          type="submit"
          disabled={saving}
          className="rounded-pill bg-primary px-5 py-2 text-sm font-medium text-text-on-primary disabled:bg-surface-muted disabled:text-text-muted"
        >
          {saving ? "저장 중…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

/**
 * 임의 키를 갖는 링크 맵 편집기 (보유자 snsLinks).
 * 고정 필드로 만들면 백엔드가 허용하는 다른 키가 수정 시 사라진다.
 */
export function KeyValueField({
  label,
  hint,
  value,
  onChange,
}: {
  label: string;
  hint?: string;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}) {
  const entries = Object.entries(value);

  const update = (index: number, key: string, val: string) => {
    const next = entries.map((e, i) => (i === index ? [key, val] : e));
    onChange(Object.fromEntries(next.filter(([k]) => k.trim() !== "")));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium">{label}</span>
        <button
          type="button"
          onClick={() => onChange({ ...value, "": "" })}
          className="rounded-sm border border-border-base px-3 py-1 text-xs"
        >
          링크 추가
        </button>
      </div>
      {hint && <span className="text-xs text-text-muted">{hint}</span>}
      {entries.length === 0 ? (
        <p className="rounded-sm border border-dashed border-border-base px-3 py-4 text-center text-xs text-text-muted">
          등록된 링크가 없습니다.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {entries.map(([k, v], i) => (
            <li key={i} className="flex gap-2">
              <Input
                value={k}
                onChange={(e) => update(i, e.target.value, v)}
                placeholder="instagram"
                className="max-w-[160px]"
              />
              <Input
                value={v}
                onChange={(e) => update(i, k, e.target.value)}
                placeholder="https://..."
              />
              <button
                type="button"
                onClick={() =>
                  onChange(Object.fromEntries(entries.filter((_, idx) => idx !== i)))
                }
                aria-label="링크 삭제"
                className="rounded-sm border border-border-base px-2 text-xs text-error"
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
