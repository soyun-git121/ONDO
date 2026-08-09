import { Link } from "react-router-dom";
import { SITE_NAV } from "../../constants/nav";
import { SOCIAL } from "../../constants/social";

/** href가 null이면 아직 채널이 없는 것 — 링크 대신 '준비 중'으로 그린다. */
const FOOTER_SOCIAL: { href: string | null; label: string }[] = [
  { href: SOCIAL.instagram, label: "Instagram" },
  { href: SOCIAL.youtube, label: "YouTube" },
];

/**
 * Footer — design/figma 하단 라임(brand-primary) 바.
 * 상단: 좌 워드마크 "ONDO" + 슬로건 · 우 내비 / 검정 구분선 / 하단: 카피라이트 · 소셜.
 * 라임 위 텍스트는 반드시 검정(text-primary)/muted — design.md Contrast rules. 흰 텍스트 금지.
 */
export default function Footer() {
  return (
    <footer className="bg-primary text-text-primary">
      <div className="mx-auto max-w-[1280px] px-3 py-9 lg:px-5 lg:py-10">
        {/* 상단: 워드마크+슬로건(좌) · 내비(우) */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-start">
          <div className="flex flex-col gap-2">
            <Link to="/" className="font-display text-[1.625rem] font-bold leading-none tracking-tight">
              ONDO
            </Link>
            <p className="text-sm text-text-muted">전통의 온도를 잇습니다</p>
          </div>
          <nav
            aria-label="푸터 메뉴"
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium"
          >
            {SITE_NAV.map((m) => (
              <Link key={m.to} to={m.to} className="underline-offset-4 hover:underline">
                {m.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* 하단: 카피라이트(좌) · 소셜·협업(우) — 검정 구분선 */}
        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-text-primary pt-5 text-xs text-text-muted sm:flex-row sm:items-center">
          <p>© 2026 ONDO · 전통문화 소속사</p>
          <div className="flex items-center gap-2">
            {FOOTER_SOCIAL.map((s, i) => (
              <span key={s.label} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden="true">·</span>}
                {s.href ? (
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    {s.label}
                  </a>
                ) : (
                  <span>{s.label} (준비 중)</span>
                )}
              </span>
            ))}
            <span aria-hidden="true">·</span>
            <Link to="/collaboration" className="underline-offset-4 hover:underline">
              협업 문의
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
