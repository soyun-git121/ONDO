package kr.ondo.domain.project.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;
import kr.ondo.domain.project.entity.ProjectType;

/** PUT /api/admin/projects/{id} 요청. slug 불변. */
public record ProjectUpdateRequest(
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
        @Valid List<ProjectCreateRequest.ImageRequest> images,
        @Valid List<ProjectCreateRequest.ArtisanRequest> artisans
) {
}
