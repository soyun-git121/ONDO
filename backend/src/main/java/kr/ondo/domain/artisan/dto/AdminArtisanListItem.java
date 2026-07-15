package kr.ondo.domain.artisan.dto;

import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.entity.Designation;

/**
 * 관리자 보유자 목록 항목 (비공개 포함). api.md §8.
 */
public record AdminArtisanListItem(
        Long id,
        String slug,
        String name,
        String title,
        Designation designation,
        int displayOrder,
        boolean published
) {
    public static AdminArtisanListItem from(Artisan a) {
        return new AdminArtisanListItem(
                a.getId(), a.getSlug(), a.getName(), a.getTitle(),
                a.getDesignation(), a.getDisplayOrder(), a.isPublished()
        );
    }
}
