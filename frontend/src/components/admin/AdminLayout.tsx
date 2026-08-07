import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useAdminAuth } from "../../auth/AdminAuthContext";
import { ToastProvider } from "./Feedback";

const NAV = [
  { to: "/admin/artisans", label: "보유자" },
  { to: "/admin/products", label: "상품" },
  { to: "/admin/news", label: "뉴스" },
  { to: "/admin/projects", label: "협업 실적" },
  { to: "/admin/inquiries", label: "문의" },
  { to: "/admin/orders", label: "주문" },
];

/** 로그인하지 않았으면 로그인 화면으로 보낸다. */
export function RequireAuth({ children }: { children: ReactNode }) {
  const { authenticated } = useAdminAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authenticated) navigate("/admin/login", { replace: true });
  }, [authenticated, navigate]);

  if (!authenticated) return null;
  return <>{children}</>;
}

/**
 * 관리자 레이아웃 — 공개 사이트 Layout과 분리한다.
 * 공개 화면의 전통 문양 배경·큰 여백은 데이터 밀도를 해치므로 쓰지 않는다.
 */
export default function AdminLayout() {
  const { logout } = useAdminAuth();

  return (
    <RequireAuth>
      <ToastProvider>
        <div className="flex min-h-screen bg-bg-base">
          <aside className="hidden w-48 shrink-0 border-r border-border-base bg-surface p-4 sm:block">
            <NavLink to="/admin" end className="block font-display text-md font-bold">
              ONDO<span className="text-text-muted"> admin</span>
            </NavLink>
            <nav className="mt-5 flex flex-col gap-1">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `rounded-sm px-3 py-2 text-sm ${
                      isActive ? "bg-primary font-medium text-text-on-primary" : "hover:bg-surface-muted"
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between gap-3 border-b border-border-base bg-surface px-4 py-2">
              {/* 모바일에서는 사이드바 대신 가로 스크롤 탭 */}
              <nav className="flex gap-1 overflow-x-auto sm:hidden">
                {NAV.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `whitespace-nowrap rounded-sm px-2 py-1 text-xs ${
                        isActive ? "bg-primary font-medium" : "text-text-muted"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="ml-auto flex items-center gap-3">
                <a
                  href="/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-text-muted underline-offset-4 hover:underline"
                >
                  사이트 보기
                </a>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-sm border border-border-base px-3 py-1 text-xs"
                >
                  로그아웃
                </button>
              </div>
            </header>

            <main className="min-w-0 flex-1 p-4">
              <Outlet />
            </main>
          </div>
        </div>
      </ToastProvider>
    </RequireAuth>
  );
}
