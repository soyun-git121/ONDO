import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

/**
 * 관리자 폼 프리미티브. 공개 사이트 컴포넌트보다 조밀하다 —
 * 관리 화면은 한 화면에 필드가 많아 여백보다 밀도를 우선한다.
 * 색·간격은 전부 토큰(tailwind.config.js) 경유 — raw hex 금지.
 */

const controlBase =
  "w-full rounded-sm border border-border-base bg-surface px-3 py-2 text-sm " +
  "placeholder:text-text-muted disabled:cursor-not-allowed disabled:bg-surface-muted " +
  "disabled:text-text-muted";

export function Field({
  label,
  hint,
  required,
  error,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-medium">
        {label}
        {required && (
          <span className="ml-1 text-error" aria-hidden="true">
            *
          </span>
        )}
      </span>
      {children}
      {error ? (
        <span className="text-xs text-error">{error}</span>
      ) : hint ? (
        <span className="text-xs text-text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  const { className = "", ...rest } = props;
  return <input {...rest} className={`${controlBase} ${className}`} />;
}

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className = "", rows = 6, ...rest } = props;
  return <textarea {...rest} rows={rows} className={`${controlBase} ${className}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  const { className = "", ...rest } = props;
  return <select {...rest} className={`${controlBase} ${className}`} />;
}

/** 라벨 있는 enum 셀렉트 — options는 [값, 표시명] 쌍. */
export function EnumSelect<T extends string>({
  value,
  onChange,
  options,
  ...rest
}: {
  value: T;
  onChange: (value: T) => void;
  options: Record<T, string>;
} & Omit<SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange">) {
  return (
    <Select {...rest} value={value} onChange={(e) => onChange(e.target.value as T)}>
      {(Object.keys(options) as T[]).map((key) => (
        <option key={key} value={key}>
          {options[key]}
        </option>
      ))}
    </Select>
  );
}

export function Checkbox({
  label,
  checked,
  onChange,
  hint,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  hint?: string;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-[3px] h-4 w-4 shrink-0 accent-text-primary"
      />
      <span className="flex flex-col">
        <span className="text-sm">{label}</span>
        {hint && <span className="text-xs text-text-muted">{hint}</span>}
      </span>
    </label>
  );
}

/** 폼 안의 논리 구획. 필드가 많은 화면에서 스캔을 돕는다. */
export function FormSection({
  title,
  description,
  children,
  columns = 2,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  columns?: 1 | 2;
}) {
  return (
    <section className="rounded-md border border-border-base bg-surface p-4">
      <h2 className="text-sm font-semibold">{title}</h2>
      {description && <p className="mt-1 text-xs text-text-muted">{description}</p>}
      <div
        className={`mt-3 grid gap-3 ${columns === 2 ? "sm:grid-cols-2" : "grid-cols-1"}`}
      >
        {children}
      </div>
    </section>
  );
}

/** 그리드 안에서 한 줄 전체를 쓰는 필드용 래퍼. */
export function FullWidth({ children }: { children: ReactNode }) {
  return <div className="sm:col-span-2">{children}</div>;
}
