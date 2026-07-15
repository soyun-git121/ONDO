package kr.ondo.domain.news.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import kr.ondo.domain.news.entity.NewsCategory;
import kr.ondo.domain.news.entity.NewsType;

/** PUT /api/admin/news/{id} 요청 (published는 PATCH /publish로 별도). */
public record NewsUpdateRequest(
        @NotBlank String title,
        String thumbnailUrl,
        @NotNull NewsType type,
        String content,
        String externalUrl,
        String sourceName,
        @NotNull NewsCategory category,
        Long artisanId,
        LocalDateTime publishedAt
) {
}
