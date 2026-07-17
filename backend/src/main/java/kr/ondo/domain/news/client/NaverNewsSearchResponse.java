package kr.ondo.domain.news.client;

import java.util.List;

/** 네이버 뉴스 검색 API 응답 래퍼. */
public record NaverNewsSearchResponse(List<NaverNewsItem> items) {
}
