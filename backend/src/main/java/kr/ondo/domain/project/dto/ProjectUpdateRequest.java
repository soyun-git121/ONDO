package kr.ondo.domain.project.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.time.LocalDate;
import java.util.List;
import kr.ondo.domain.project.entity.ProjectType;
import kr.ondo.global.validation.SlugPattern;

/**
 * PUT /api/admin/projects/{id} 요청.
 *
 * <p>slug는 원래 불변이었다. 잘못 저장된 값을 admin이 고칠 방법이 없어 열었다(V3 참고).
 * 바꾸면 공개 URL이 바뀌어 기존에 공유된 링크가 404가 되므로, 화면에서 그 점을 경고한다.
 */
public record ProjectUpdateRequest(
        @NotBlank @Pattern(regexp = SlugPattern.REGEXP, message = SlugPattern.MESSAGE) String slug,
        @NotBlank String title,
        @NotNull ProjectType type,
        String clientName,
        String summary,
        String description,
        String resultMetric,
        String thumbnailUrl,
        @NotNull LocalDate projectDate,
        boolean showOnHome,
        boolean showOnCollaboration,
        int displayOrder,
        boolean published,
        @Valid List<ProjectCreateRequest.ImageRequest> images,
        @Valid List<ProjectCreateRequest.ArtisanRequest> artisans
) {
}
