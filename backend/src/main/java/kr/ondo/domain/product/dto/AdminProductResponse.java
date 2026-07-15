package kr.ondo.domain.product.dto;

import java.util.List;
import kr.ondo.domain.product.entity.Product;
import kr.ondo.domain.product.entity.ProductCategory;
import kr.ondo.domain.product.entity.ProductStatus;

/** 관리자용 상품 상세 (HIDDEN 포함). api.md §8. */
public record AdminProductResponse(
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
        Long artisanId,
        String artisanName,
        List<ImageItem> images
) {
    public record ImageItem(String imageUrl, String caption, int sortOrder) {
    }

    public static AdminProductResponse from(Product p) {
        List<ImageItem> imgs = p.getImages().stream()
                .map(i -> new ImageItem(i.getImageUrl(), i.getCaption(), i.getSortOrder()))
                .toList();
        return new AdminProductResponse(
                p.getId(), p.getSlug(), p.getName(), p.getCategory(), p.getPrice(), p.getStatus(),
                p.getStockQuantity(), p.getSummary(), p.getDescription(), p.getThumbnailUrl(),
                p.getExternalUrl(), p.getArtisan().getId(), p.getArtisan().getName(), imgs
        );
    }
}
