package kr.ondo.domain.news.dto;

import java.time.LocalDateTime;
import kr.ondo.domain.news.entity.News;
import kr.ondo.domain.news.entity.NewsCategory;

/**
 * GET /api/news/{id} — ORIGINAL 전용. api.md §5.
 */
public record NewsDetailResponse(
        Long id,
        String title,
        NewsCategory category,
        String content,
        String thumbnailUrl,
        LocalDateTime publishedAt,
        ArtisanRef artisan
) {
    public record ArtisanRef(String slug, String name) {
    }

    public static NewsDetailResponse from(News n) {
        ArtisanRef ref = n.getArtisan() == null
                ? null
                : new ArtisanRef(n.getArtisan().getSlug(), n.getArtisan().getName());
        return new NewsDetailResponse(
                n.getId(), n.getTitle(), n.getCategory(), n.getContent(),
                n.getThumbnailUrl(), n.getPublishedAt(), ref
        );
    }
}
