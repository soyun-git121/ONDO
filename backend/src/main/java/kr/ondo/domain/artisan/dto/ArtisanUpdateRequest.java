package kr.ondo.domain.artisan.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import java.util.Map;
import kr.ondo.domain.artisan.entity.Designation;

/**
 * PUT /api/admin/artisans/{id} 요청. slug는 식별자라 변경 불가(요청에 없음).
 */
public record ArtisanUpdateRequest(
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
        @Valid List<ArtisanCreateRequest.ImageRequest> images
) {
}
