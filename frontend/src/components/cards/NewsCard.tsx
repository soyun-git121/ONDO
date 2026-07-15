import { Link } from "react-router-dom";
import { NEWS_CATEGORY_LABEL, type NewsSummary } from "../../types/news";
import CardImage from "./CardImage";

/**
 * 뉴스 카드. type=CURATED는 외부 기사 링크(새 탭), ORIGINAL은 상세 페이지로 (api.md §5).
 */
export default function NewsCard({ news }: { news: NewsSummary }) {
  const body = (
    <>
      <CardImage src={news.thumbnailUrl} alt={news.title} />
      <div className="flex flex-col gap-2 p-4">
        <span className="w-fit rounded-pill bg-surface-muted px-3 py-1 text-xs">
          {NEWS_CATEGORY_LABEL[news.category]}
        </span>
        <span className="text-lg font-bold">{news.title}</span>
        <span className="text-xs text-text-muted">
          {news.sourceName ? `${news.sourceName} · ` : ""}
          {new Date(news.publishedAt).toLocaleDateString("ko-KR")}
        </span>
      </div>
    </>
  );

  const cardClass =
    "group block overflow-hidden rounded-md bg-surface shadow-1 transition-shadow duration-fast hover:shadow-2 active:scale-[0.98]";

  if (news.type === "CURATED" && news.externalUrl) {
    return (
      <a href={news.externalUrl} target="_blank" rel="noopener noreferrer" className={cardClass}>
        {body}
      </a>
    );
  }
  return (
    <Link to={`/news/${news.id}`} className={cardClass}>
      {body}
    </Link>
  );
}
