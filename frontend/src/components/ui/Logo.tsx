import logoUrl from "../../assets/logo.svg";

/**
 * ONDO 로고 — Figma foundation "ondo-logo-black"(237:66) 원본 워드마크(src/assets/logo.svg).
 * 벡터 4-path(O·N·D·O)가 피그마 시안과 동일. 로고 교체 시 이 SVG만 바꾸면 전체 반영된다.
 */
export default function Logo({ className = "h-6" }: { className?: string }) {
  return <img src={logoUrl} alt="ONDO" className={className} />;
}
