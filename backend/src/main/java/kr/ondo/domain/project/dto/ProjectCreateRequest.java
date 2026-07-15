package kr.ondo.domain.project.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import kr.ondo.domain.project.entity.ProjectType;

/** POST /api/admin/projects 요청. api.md §8 (artisans: [{artisanId, role}]). */
public record ProjectCreateRequest(
        @NotBlank String slug,
        @NotBlank String title,
        @NotNull ProjectType type,
        String clientName,
        String summary,
        String description,
        String resultMetric,
        String thumbnailUrl,
        @NotNull LocalDate projectDate,
        boolean isFeatured,
        int displayOrder,
        boolean published,
        @Valid List<ImageRequest> images,
        @Valid List<ArtisanRequest> artisans
) {
    public record ImageRequest(@NotBlank String imageUrl, String caption, int sortOrder) {
    }

    public record ArtisanRequest(@NotNull Long artisanId, String role) {
    }
}
