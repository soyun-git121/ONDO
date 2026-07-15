package kr.ondo.domain.news.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import kr.ondo.domain.news.entity.NewsCategory;
import kr.ondo.domain.news.entity.NewsType;

/** POST /api/admin/news 요청. api.md §8. */
public record NewsCreateRequest(
        @NotBlank String title,
        String thumbnailUrl,
        @NotNull NewsType type,
        String content,
        String externalUrl,
        String sourceName,
        @NotNull NewsCategory category,
        Long artisanId,
        boolean published,
        LocalDateTime publishedAt
) {
}
