import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../auth/AdminAuthContext";
import { Field, Input } from "../../components/admin/Form";
import { ErrorNotice } from "../../components/admin/Ui";

export default function AdminLogin() {
  const { authenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (authenticated) navigate("/admin", { replace: true });
  }, [authenticated, navigate]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(username, password);
      navigate("/admin", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-base p-4">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-md border border-border-base bg-surface p-5"
      >
        <h1 className="font-display text-md font-bold">
          ONDO<span className="text-text-muted"> admin</span>
        </h1>
        <p className="mt-1 text-xs text-text-muted">관리자 계정으로 로그인하세요.</p>

        <div className="mt-4 flex flex-col gap-3">
          <Field label="아이디" required>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              autoFocus
              required
            />
          </Field>
          <Field label="비밀번호" required>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </Field>

          {error && <ErrorNotice message={error} />}

          <button
            type="submit"
            disabled={busy}
            className="min-h-[44px] rounded-pill bg-primary px-5 text-base font-medium text-text-on-primary disabled:bg-surface-muted disabled:text-text-muted"
          >
            {busy ? "로그인 중…" : "로그인"}
          </button>
        </div>
      </form>
    </div>
  );
}
