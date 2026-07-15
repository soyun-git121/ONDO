package kr.ondo.domain.artisan.dto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.domain.artisan.entity.Designation;

/**
 * GET /api/artisans/{slug} — 상세 + 갤러리 + 대표 상품 + 참여 프로젝트. api.md §2.
 *
 * products·projects는 ArtisanService에서 Product·Project 레포지토리로 채운다(api.md §2).
 */
public record ArtisanDetailResponse(
        String slug,
        String name,
        String title,
        Designation designation,
        String shortIntro,
        String story,
        String coverImageUrl,
        String profileImageUrl,
        String videoUrl,
        Map<String, String> snsLinks,
        List<ImageItem> images,
        List<ProductItem> products,
        List<ProjectItem> projects
) {
    public record ImageItem(String imageUrl, String caption, int sortOrder) {
    }

    public record ProductItem(String slug, String name, int price, String category, String status,
                              String thumbnailUrl) {
    }

    public record ProjectItem(String slug, String title, String type, String resultMetric,
                              LocalDate projectDate, String thumbnailUrl) {
    }

    public static ArtisanDetailResponse from(Artisan a, List<ProductItem> products,
                                             List<ProjectItem> projects) {
        List<ImageItem> imgs = a.getImages().stream()
                .map(i -> new ImageItem(i.getImageUrl(), i.getCaption(), i.getSortOrder()))
                .toList();
        return new ArtisanDetailResponse(
                a.getSlug(), a.getName(), a.getTitle(), a.getDesignation(),
                a.getShortIntro(), a.getStory(), a.getCoverImageUrl(), a.getProfileImageUrl(),
                a.getVideoUrl(), a.getSnsLinks() == null ? Map.of() : a.getSnsLinks(),
                imgs, products, projects
        );
    }
}
