import type { CSSProperties, ReactNode } from "react";
import { Link } from "react-router-dom";
import type { NewsSummary } from "../../types/news";

/**
 * 뉴스 링크 래퍼 — CURATED(네이버 임포트 등 외부 기사)는 새 탭, ORIGINAL은 상세로 (api.md §5).
 * 이 분기 규칙의 단일 정본. 카드 모양은 호출부가 정하고, 여기서는 "어디로 가는가"만 책임진다.
 * CURATED인데 externalUrl이 비어 있으면 갈 곳이 없으므로 상세로 폴백한다.
 */
export default function NewsLink({
  news,
  className,
  style,
  children,
}: {
  news: NewsSummary;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  if (news.type === "CURATED" && news.externalUrl) {
    return (
      <a
        href={news.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={style}
      >
        {children}
      </a>
    );
  }
  return (
    <Link to={`/news/${news.id}`} className={className} style={style}>
      {children}
    </Link>
  );
}
