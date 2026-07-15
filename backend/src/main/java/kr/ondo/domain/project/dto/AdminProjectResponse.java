package kr.ondo.domain.project.dto;

import java.time.LocalDate;
import java.util.List;
import kr.ondo.domain.project.entity.Project;
import kr.ondo.domain.project.entity.ProjectType;

/** 관리자용 실적 상세 (비공개 포함). api.md §8. */
public record AdminProjectResponse(
        Long id,
        String slug,
        String title,
        ProjectType type,
        String clientName,
        String summary,
        String description,
        String resultMetric,
        String thumbnailUrl,
        LocalDate projectDate,
        boolean featured,
        int displayOrder,
        boolean published,
        List<ImageItem> images,
        List<ArtisanItem> artisans
) {
    public record ImageItem(String imageUrl, String caption, int sortOrder) {
    }

    public record ArtisanItem(Long artisanId, String name, String role) {
    }

    public static AdminProjectResponse from(Project p) {
        List<ImageItem> images = p.getImages().stream()
                .map(i -> new ImageItem(i.getImageUrl(), i.getCaption(), i.getSortOrder()))
                .toList();
        List<ArtisanItem> artisans = p.getParticipants().stream()
                .map(pa -> new ArtisanItem(pa.getArtisan().getId(), pa.getArtisan().getName(), pa.getRole()))
                .toList();
        return new AdminProjectResponse(
                p.getId(), p.getSlug(), p.getTitle(), p.getType(), p.getClientName(), p.getSummary(),
                p.getDescription(), p.getResultMetric(), p.getThumbnailUrl(), p.getProjectDate(),
                p.isFeatured(), p.getDisplayOrder(), p.isPublished(), images, artisans
        );
    }
}
