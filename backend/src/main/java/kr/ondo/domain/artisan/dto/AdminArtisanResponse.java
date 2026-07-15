package kr.ondo.domain.artisan.dto;

import java.util.List;
import java.util.Map;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.entity.Designation;

/**
 * 관리자용 보유자 상세 (비공개 필드 포함). api.md §8.
 */
public record AdminArtisanResponse(
        Long id,
        String slug,
        String name,
        String title,
        Designation designation,
        String shortIntro,
        String story,
        String profileImageUrl,
        String coverImageUrl,
        String videoUrl,
        Map<String, String> snsLinks,
        int displayOrder,
        boolean published,
        List<ImageItem> images
) {
    public record ImageItem(String imageUrl, String caption, int sortOrder) {
    }

    public static AdminArtisanResponse from(Artisan a) {
        List<ImageItem> imgs = a.getImages().stream()
                .map(i -> new ImageItem(i.getImageUrl(), i.getCaption(), i.getSortOrder()))
                .toList();
        return new AdminArtisanResponse(
                a.getId(), a.getSlug(), a.getName(), a.getTitle(), a.getDesignation(),
                a.getShortIntro(), a.getStory(), a.getProfileImageUrl(), a.getCoverImageUrl(),
                a.getVideoUrl(), a.getSnsLinks() == null ? Map.of() : a.getSnsLinks(),
                a.getDisplayOrder(), a.isPublished(), imgs
        );
    }
}
