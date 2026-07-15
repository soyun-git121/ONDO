package kr.ondo.domain.news.dto;

import java.time.LocalDateTime;
import kr.ondo.domain.news.entity.News;
import kr.ondo.domain.news.entity.NewsCategory;
import kr.ondo.domain.news.entity.NewsType;

/**
 * GET /api/news content 항목. api.md §5.
 * type=CURATED면 프론트에서 externalUrl 새 탭 이동(상세 없음).
 */
public record NewsSummaryResponse(
        Long id,
        String title,
        NewsType type,
        NewsCategory category,
        String thumbnailUrl,
        String sourceName,
        String externalUrl,
        LocalDateTime publishedAt
) {
    public static NewsSummaryResponse from(News n) {
        return new NewsSummaryResponse(
                n.getId(), n.getTitle(), n.getType(), n.getCategory(),
                n.getThumbnailUrl(), n.getSourceName(), n.getExternalUrl(), n.getPublishedAt()
        );
    }
}
