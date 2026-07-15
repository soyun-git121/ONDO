package kr.ondo.domain.artisan.dto;

import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.entity.Designation;

/**
 * GET /api/artisans content 항목 (카드용 요약). api.md §2.
 */
public record ArtisanSummaryResponse(
        String slug,
        String name,
        String title,
        Designation designation,
        String shortIntro,
        String profileImageUrl
) {
    public static ArtisanSummaryResponse from(Artisan a) {
        return new ArtisanSummaryResponse(
                a.getSlug(), a.getName(), a.getTitle(),
                a.getDesignation(), a.getShortIntro(), a.getProfileImageUrl()
        );
    }
}
