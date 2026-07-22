import patternUrl from "../../assets/background-pattern.svg";

/**
 * 전통 구름 문양 배경 — Figma foundation 컴포넌트 "BackgroundPattern / cloud" (239:33) 이식.
 * 라임(brand-primary) 구름 12개를 opacity 0.3으로 흩어 놓은 벡터 패턴(원본 그대로).
 * 콘텐츠 뒤 장식층(aria-hidden). 문서 전체 높이를 덮도록 세로 반복.
 *
 * 색은 asset(#E0F69D = --color-brand-primary)에 구워져 있음 — 라임 토큰을 바꾸면
 * 이 SVG(src/assets/background-pattern.svg)의 fill도 함께 교체할 것.
 */
export default function BackgroundPattern({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 bg-top bg-repeat-y ${className}`}
      style={{ backgroundImage: `url(${patternUrl})`, backgroundSize: "1440px auto" }}
    />
  );
}
