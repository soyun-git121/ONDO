package kr.ondo.domain.news.dto;

import java.time.LocalDateTime;
import kr.ondo.domain.news.entity.News;
import kr.ondo.domain.news.entity.NewsCategory;
import kr.ondo.domain.news.entity.NewsType;

/** 관리자용 뉴스 상세 (비공개 포함). api.md §8. */
public record AdminNewsResponse(
        Long id,
        String title,
        String thumbnailUrl,
        NewsType type,
        String content,
        String externalUrl,
        String sourceName,
        NewsCategory category,
        Long artisanId,
        boolean published,
        LocalDateTime publishedAt
) {
    public static AdminNewsResponse from(News n) {
        return new AdminNewsResponse(
                n.getId(), n.getTitle(), n.getThumbnailUrl(), n.getType(), n.getContent(),
                n.getExternalUrl(), n.getSourceName(), n.getCategory(),
                n.getArtisan() == null ? null : n.getArtisan().getId(),
                n.isPublished(), n.getPublishedAt()
        );
    }
}
