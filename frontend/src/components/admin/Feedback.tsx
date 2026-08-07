import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";

/* ---------- Toast ---------- */

interface Toast {
  id: number;
  message: string;
  tone: "success" | "error";
}

interface ToastApi {
  success: (message: string) => void;
  error: (message: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

/**
 * 저장·삭제 결과를 알리는 최소 토스트. 관리 화면은 조작 결과 확인이 잦아
 * 페이지 전환 없이 즉시 피드백을 준다.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);

  const push = useCallback((message: string, tone: Toast["tone"]) => {
    const id = ++seq.current;
    setToasts((prev) => [...prev, { id, message, tone }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-sm px-4 py-2 text-sm shadow-2 ${
              t.tone === "success" ? "bg-primary text-text-on-primary" : "bg-error text-surface"
            }`}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast는 ToastProvider 안에서만 쓸 수 있습니다.");
  return ctx;
}

/* ---------- ConfirmDialog ---------- */

/**
 * 삭제처럼 되돌릴 수 없는 조작 앞에 세우는 확인 창.
 * 열렸을 때 Esc로 닫히고, 확인 버튼에 포커스가 간다.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "삭제",
  onConfirm,
  onCancel,
  busy = false,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
}) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-text-primary/40 p-4">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="w-full max-w-sm rounded-md bg-surface p-4 shadow-2"
      >
        <h2 id="confirm-title" className="text-sm font-semibold">
          {title}
        </h2>
        {description && <p className="mt-2 text-xs text-text-muted">{description}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-sm border border-border-base px-3 py-2 text-sm"
          >
            취소
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className="rounded-sm bg-error px-3 py-2 text-sm text-surface disabled:opacity-60"
          >
            {busy ? "처리 중…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
