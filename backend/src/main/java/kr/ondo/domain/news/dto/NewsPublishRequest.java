package kr.ondo.domain.news.dto;

/** PATCH /api/admin/news/{id}/publish 요청. */
public record NewsPublishRequest(boolean published) {
}
