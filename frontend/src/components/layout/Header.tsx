import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import Logo from "../ui/Logo";

// Figma foundation "Header / global"(239:43) nav — 로고 + 6개 평범 항목(도트 CTA 없음).
// 라벨은 Figma 시안 그대로: 보유자 메뉴는 영문 'Holder'(푸터는 '보유자' 유지).
const MENU = [
  { to: "/about", label: "About" },
  { to: "/artisans", label: "Holder" },
  { to: "/shop", label: "Shop" },
  { to: "/projects", label: "Project" },
  { to: "/news", label: "News" },
  { to: "/collaboration", label: "협업문의" },
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
  // 모든 페이지 헤더 하단 구분선 없음(Figma). 홈은 로고 없이 nav만 사용.
  const isHome = location.pathname === "/";

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
    <header className="sticky top-0 z-40 bg-bg-base/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-3 lg:h-20 lg:px-5">
        {/* 홈(Figma 와이어프레임)은 헤더에서 nav만 사용 — 대형 로고는 히어로에 별도 배치.
            그 외 페이지는 로고 + nav. (justify-between 유지 위해 홈에서도 좌측 슬롯은 빈칸) */}
        {isHome ? (
          <div aria-hidden="true" />
        ) : (
          <Link to="/" aria-label="ONDO 홈으로">
            <Logo className="h-6 lg:h-7" />
          </Link>
        )}

        {/* 데스크톱 메뉴 — Figma: 우측 정렬 단일 nav, 항목 간격 40px */}
        <nav aria-label="주 메뉴" className="hidden items-center gap-x-10 lg:flex">
          {MENU.map((m) => (
            <NavLink key={m.to} to={m.to} className={navLinkClass}>
              {m.label}
            </NavLink>
          ))}
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
        </div>
      )}
    </header>
  );
}
