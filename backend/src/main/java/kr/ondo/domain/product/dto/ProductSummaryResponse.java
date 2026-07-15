package kr.ondo.domain.product.dto;

import kr.ondo.domain.product.entity.Product;
import kr.ondo.domain.product.entity.ProductCategory;
import kr.ondo.domain.product.entity.ProductStatus;

/**
 * GET /api/products content 항목. api.md §3 (id 포함 — 주문 생성 참조키).
 */
public record ProductSummaryResponse(
        Long id,
        String slug,
        String name,
        int price,
        ProductCategory category,
        ProductStatus status,
        String summary,
        String thumbnailUrl,
        String artisanName,
        String artisanSlug
) {
    public static ProductSummaryResponse from(Product p) {
        return new ProductSummaryResponse(
                p.getId(), p.getSlug(), p.getName(), p.getPrice(),
                p.getCategory(), p.getStatus(), p.getSummary(), p.getThumbnailUrl(),
                p.getArtisan().getName(), p.getArtisan().getSlug()
        );
    }
}
