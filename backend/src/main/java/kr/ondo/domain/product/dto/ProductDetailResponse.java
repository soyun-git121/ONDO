package kr.ondo.domain.product.dto;

import java.util.List;
import kr.ondo.domain.product.entity.Product;
import kr.ondo.domain.product.entity.ProductCategory;
import kr.ondo.domain.product.entity.ProductStatus;

/**
 * GET /api/products/{slug}. api.md §3 (id 포함).
 */
public record ProductDetailResponse(
        Long id,
        String slug,
        String name,
        ProductCategory category,
        int price,
        ProductStatus status,
        int stockQuantity,
        String summary,
        String description,
        String thumbnailUrl,
        String externalUrl,
        List<ImageItem> images,
        ArtisanRef artisan
) {
    public record ImageItem(String imageUrl, String caption, int sortOrder) {
    }

    public record ArtisanRef(String slug, String name, String title, String profileImageUrl,
                             String shortIntro) {
    }

    public static ProductDetailResponse from(Product p) {
        List<ImageItem> imgs = p.getImages().stream()
                .map(i -> new ImageItem(i.getImageUrl(), i.getCaption(), i.getSortOrder()))
                .toList();
        var a = p.getArtisan();
        return new ProductDetailResponse(
                p.getId(), p.getSlug(), p.getName(), p.getCategory(), p.getPrice(),
                p.getStatus(), p.getStockQuantity(), p.getSummary(), p.getDescription(),
                p.getThumbnailUrl(), p.getExternalUrl(), imgs,
                new ArtisanRef(a.getSlug(), a.getName(), a.getTitle(), a.getProfileImageUrl(),
                        a.getShortIntro())
        );
    }
}
