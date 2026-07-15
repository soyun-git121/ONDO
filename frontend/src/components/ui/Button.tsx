import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  children: ReactNode;
}

const base =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-pill px-5 py-3 text-base font-medium transition-all duration-fast";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-text-primary hover:brightness-[0.94] active:scale-[0.98]",
  secondary:
    "border border-border-base bg-transparent text-text-primary hover:border-text-primary active:scale-[0.98]",
  ghost: "rounded-sm px-3 py-2 underline-offset-4 hover:underline",
};

/**
 * design.md §4 Button. disabled/loading 상태 규칙 포함.
 * 라벨은 동사형("협업 문의하기") — "확인"류 모호 라벨 금지.
 */
export default function Button({
  variant = "primary",
  loading = false,
  disabled,
  children,
  className = "",
  ...rest
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <button
      {...rest}
      disabled={isDisabled}
      aria-disabled={isDisabled || undefined}
      aria-busy={loading || undefined}
      className={`${base} ${variants[variant]} ${
        isDisabled ? "cursor-not-allowed !bg-surface-muted !text-text-muted" : ""
      } ${className}`}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-pill border-2 border-text-muted border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}
