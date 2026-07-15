/** News DTO — api.md §5와 1:1 */

export type NewsType = "ORIGINAL" | "CURATED";
export type NewsCategory = "ONDO_NEWS" | "TRADITION" | "ARTISAN";

export const NEWS_CATEGORY_LABEL: Record<NewsCategory, string> = {
  ONDO_NEWS: "온도 소식",
  TRADITION: "전통문화",
  ARTISAN: "보유자 소식",
};

/** GET /api/news content 항목 */
export interface NewsSummary {
  id: number;
  title: string;
  type: NewsType;
  category: NewsCategory;
  thumbnailUrl: string | null;
  sourceName: string | null;
  externalUrl: string | null;
  publishedAt: string;
}

/** GET /api/news/{id} — ORIGINAL 전용 */
export interface NewsDetail {
  id: number;
  title: string;
  category: NewsCategory;
  content: string;
  thumbnailUrl: string | null;
  publishedAt: string;
  artisan: { slug: string; name: string } | null;
}
