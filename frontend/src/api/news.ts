import { get } from "./client";
import type { PageResponse } from "../types/common";
import type { NewsCategory, NewsDetail, NewsSummary } from "../types/news";

export function getNewsList(params: {
  page?: number;
  size?: number;
  category?: NewsCategory;
}): Promise<PageResponse<NewsSummary>> {
  return get<PageResponse<NewsSummary>>("/news", params);
}

export function getNews(id: number): Promise<NewsDetail> {
  return get<NewsDetail>(`/news/${id}`);
}
