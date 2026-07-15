package kr.ondo.domain.project.dto;

import java.time.LocalDate;
import java.util.List;
import kr.ondo.domain.project.entity.Project;
import kr.ondo.domain.project.entity.ProjectType;

/**
 * GET /api/projects content 항목. api.md §6.
 */
public record ProjectSummaryResponse(
        String slug,
        String title,
        ProjectType type,
        String clientName,
        String summary,
        String resultMetric,
        String thumbnailUrl,
        LocalDate projectDate,
        List<ArtisanRef> artisans
) {
    public record ArtisanRef(String slug, String name) {
    }

    public static ProjectSummaryResponse from(Project p) {
        List<ArtisanRef> artisans = p.getParticipants().stream()
                .map(pa -> new ArtisanRef(pa.getArtisan().getSlug(), pa.getArtisan().getName()))
                .toList();
        return new ProjectSummaryResponse(
                p.getSlug(), p.getTitle(), p.getType(), p.getClientName(), p.getSummary(),
                p.getResultMetric(), p.getThumbnailUrl(), p.getProjectDate(), artisans
        );
    }
}
