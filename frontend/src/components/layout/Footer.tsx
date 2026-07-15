import { Link } from "react-router-dom";
import Logo from "../ui/Logo";

/** design.md §6 Footer — 상단 display 타이포 한 줄(blit 방식) + 사업자 정보/내비/SNS */
export default function Footer() {
  return (
    <footer className="border-t border-border-base bg-surface-muted">
      <div className="mx-auto max-w-[1280px] px-3 py-8 lg:px-5">
        <p className="font-display text-xl font-bold leading-tight tracking-tight lg:text-2xl">
          전통의 온도를 잇습니다
        </p>

        <div className="mt-7 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="flex flex-col gap-3">
            <Logo className="h-5" />
            {/* 사업자 정보 — 확정 전 빈칸 유지 */}
            <p className="text-xs text-text-muted">
              ONDO(온도) · 대표: (정보 준비 중) · 사업자등록번호: (정보 준비 중)
              <br />
              주소: (정보 준비 중) · 이메일: (정보 준비 중)
            </p>
          </div>

          <div className="flex items-center gap-5">
            <nav aria-label="푸터 메뉴" className="flex gap-4 text-sm">
              <Link to="/about" className="hover:underline underline-offset-4">About</Link>
              <Link to="/artisans" className="hover:underline underline-offset-4">보유자</Link>
              <Link to="/collaboration" className="hover:underline underline-offset-4">협업문의</Link>
            </nav>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="ONDO 인스타그램"
              className="flex h-11 w-11 items-center justify-center rounded-pill border border-border-base transition-colors duration-fast hover:border-text-primary"
            >
              <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="20" height="20" rx="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
