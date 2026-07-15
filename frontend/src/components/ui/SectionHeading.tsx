import { Link } from "react-router-dom";

/** 홈·목록 섹션 공통 헤딩 — 좌측 제목(display 무드), 우측 "전체 보기" 링크 */
export default function SectionHeading({
  title,
  to,
  linkLabel,
}: {
  title: string;
  to?: string;
  linkLabel?: string;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <h2 className="font-display text-xl font-bold leading-tight tracking-tight lg:text-2xl">
        {title}
      </h2>
      {to && linkLabel && (
        <Link to={to} className="shrink-0 text-sm underline-offset-4 hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
