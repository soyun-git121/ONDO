package kr.ondo.domain.artisan.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import kr.ondo.domain.artisan.entity.Designation;

/**
 * POST /api/admin/artisans 요청. api.md §8 (공개 응답 구조와 동일 필드).
 */
public record ArtisanCreateRequest(
        @NotBlank String slug,
        @NotBlank String name,
        @NotBlank String title,
        @NotNull Designation designation,
        @NotBlank String shortIntro,
        String story,
        String profileImageUrl,
        String coverImageUrl,
        String videoUrl,
        Map<String, String> snsLinks,
        int displayOrder,
        boolean published,
        @Valid List<ImageRequest> images
) {
    public record ImageRequest(@NotBlank String imageUrl, String caption, int sortOrder) {
    }
}
