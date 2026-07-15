package kr.ondo.domain.news.dto;

import java.time.LocalDateTime;
import kr.ondo.domain.news.entity.News;
import kr.ondo.domain.news.entity.NewsCategory;
import kr.ondo.domain.news.entity.NewsType;

/** 관리자 뉴스 목록 항목 (비공개 포함). */
public record AdminNewsListItem(
        Long id,
        String title,
        NewsType type,
        NewsCategory category,
        boolean published,
        LocalDateTime publishedAt
) {
    public static AdminNewsListItem from(News n) {
        return new AdminNewsListItem(
                n.getId(), n.getTitle(), n.getType(), n.getCategory(),
                n.isPublished(), n.getPublishedAt()
        );
    }
}
