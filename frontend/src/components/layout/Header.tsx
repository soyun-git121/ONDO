import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../ui/Logo";

const MENU = [
  { to: "/about", label: "About" },
  { to: "/artisans", label: "보유자" },
  { to: "/shop", label: "Shop" },
  { to: "/projects", label: "Project" },
  { to: "/news", label: "News" },
];

/**
 * design.md §1 Header(GNB).
 * sticky + blur 배경, 모바일(<lg)은 전체 화면 오버레이(display 타이포 세로 나열 — blit 방식).
 * 오버레이: Esc 닫기, 열릴 때 첫 링크 포커스, 포커스 트랩, 닫힌 후 트리거 포커스 복귀.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const location = useLocation();

  // 라우트 이동 시 오버레이 닫기
  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    if (!open) return;
    const overlay = overlayRef.current;
    overlay?.querySelector<HTMLElement>("a, button")?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !overlay) return;
      // 포커스 트랩
      const focusables = overlay.querySelectorAll<HTMLElement>("a, button");
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors duration-fast hover:underline underline-offset-8 ${
      isActive ? "underline" : ""
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-border-base bg-bg-base/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-3 lg:px-5">
        <Link to="/" aria-label="ONDO 홈으로">
          <Logo className="h-6" />
        </Link>

        {/* 데스크톱 메뉴 */}
        <nav aria-label="주 메뉴" className="hidden items-center gap-6 lg:flex">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} className={navLinkClass}>
              {m.label}
            </NavLink>
          ))}
          {/* CTA — blit 'let's talk' 방식: accent 도트 + 텍스트 (design.md §1) */}
          <Link
            to="/collaboration"
            className="flex items-center gap-2 text-sm font-medium underline-offset-8 transition-colors duration-fast hover:underline"
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
            협업문의
          </Link>
        </nav>

        {/* 모바일 햄버거 */}
        <button
          ref={triggerRef}
          type="button"
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          onClick={() => setOpen((v) => !v)}
        >
          <span aria-hidden="true" className="h-0.5 w-6 bg-text-primary" />
          <span aria-hidden="true" className="h-0.5 w-6 bg-text-primary" />
        </button>
      </div>

      {/* 모바일 전체 화면 오버레이 */}
      {open && (
        <div
          ref={overlayRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="메뉴"
          className="fixed inset-0 top-16 z-50 flex flex-col gap-4 bg-bg-base px-3 py-8 lg:hidden"
        >
          {MENU.map((m) => (
            <NavLink
              key={m.to}
              to={m.to}
              className={({ isActive }) =>
                `font-display text-2xl font-bold leading-tight tracking-tight ${
                  isActive ? "underline underline-offset-8" : ""
                }`
              }
            >
              {m.label}
            </NavLink>
          ))}
          <Link
            to="/collaboration"
            className="mt-4 inline-flex w-fit rounded-pill bg-primary px-6 py-3 text-base font-medium text-text-primary"
          >
            협업문의
          </Link>
        </div>
      )}
    </header>
  );
}
