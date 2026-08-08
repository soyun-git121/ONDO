import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { clearToken, getToken, setToken, setUnauthorizedHandler } from "../api/client";
import { login as loginRequest } from "../api/admin";

interface AdminAuth {
  authenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const Context = createContext<AdminAuth | null>(null);

/**
 * 관리자 인증 상태. 토큰은 localStorage에 두고 axios 인터셉터가 헤더에 실어 보낸다.
 * 백엔드는 refresh 토큰을 DB에 두지 않으므로(db_schema.md §12), 만료되면 다시 로그인한다.
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [authenticated, setAuthenticated] = useState(() => getToken() !== null);

  // 관리자 API가 401을 뱉으면(토큰 만료 등) 로그인 화면으로 돌린다.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAuthenticated(false);
      navigate("/admin/login", { replace: true });
    });
    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  const login = useCallback(async (username: string, password: string) => {
    const res = await loginRequest({ username, password });
    setToken(res.accessToken);
    setAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setAuthenticated(false);
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const value = useMemo(
    () => ({ authenticated, login, logout }),
    [authenticated, login, logout],
  );

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useAdminAuth(): AdminAuth {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error("useAdminAuth는 AdminAuthProvider 안에서만 쓸 수 있습니다.");
  }
  return ctx;
}
