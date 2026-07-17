/**
 * 전통 문양 — 원(엽전) + 창살 격자 모티프. design/figma 전 화면 공통 배경 장식.
 * 라임(brand-primary)으로 그려지며, 콘텐츠 뒤 장식층으로만 사용(aria-hidden).
 * 색은 currentColor — 부모의 text-* 색을 따른다.
 */
export default function TraditionMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 240"
      fill="none"
      aria-hidden="true"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke="currentColor" strokeWidth="8">
        {/* 원(엽전) */}
        <circle cx="120" cy="120" r="112" />
        {/* 창살 격자 — 세로/가로 등간격 */}
        <path d="M60 8V232M120 8V232M180 8V232M8 60H232M8 120H232M8 180H232" />
      </g>
    </svg>
  );
}
