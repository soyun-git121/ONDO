package kr.ondo.domain.news.client;

/** 네이버 뉴스 검색 API 응답 아이템. title/description은 <b> 태그·HTML 엔티티 포함 원본 그대로. */
public record NaverNewsItem(String title, String originallink, String link, String description, String pubDate) {
}
