package kr.ondo.domain.project.dto;

import java.time.LocalDate;
import java.util.List;
import kr.ondo.domain.project.entity.Project;
import kr.ondo.domain.project.entity.ProjectType;

/**
 * GET /api/projects/{slug} — 상세 + 갤러리 + 참여 보유자(role 포함). api.md §6.
 */
public record ProjectDetailResponse(
        String slug,
        String title,
        ProjectType type,
        String clientName,
        String summary,
        String description,
        String resultMetric,
        LocalDate projectDate,
        String thumbnailUrl,
        List<ImageItem> images,
        List<ArtisanRef> artisans
) {
    public record ImageItem(String imageUrl, String caption, int sortOrder) {
    }

    public record ArtisanRef(String slug, String name, String title, String role,
                             String profileImageUrl) {
    }

    public static ProjectDetailResponse from(Project p) {
        List<ImageItem> images = p.getImages().stream()
                .map(i -> new ImageItem(i.getImageUrl(), i.getCaption(), i.getSortOrder()))
                .toList();
        List<ArtisanRef> artisans = p.getParticipants().stream()
                .map(pa -> new ArtisanRef(
                        pa.getArtisan().getSlug(), pa.getArtisan().getName(),
                        pa.getArtisan().getTitle(), pa.getRole(),
                        pa.getArtisan().getProfileImageUrl()))
                .toList();
        return new ProjectDetailResponse(
                p.getSlug(), p.getTitle(), p.getType(), p.getClientName(), p.getSummary(),
                p.getDescription(), p.getResultMetric(), p.getProjectDate(), p.getThumbnailUrl(),
                images, artisans
        );
    }
}
