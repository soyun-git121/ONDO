package kr.ondo.domain.product.dto;

import kr.ondo.domain.product.entity.Product;
import kr.ondo.domain.product.entity.ProductCategory;
import kr.ondo.domain.product.entity.ProductStatus;

/** 관리자 상품 목록 항목 (HIDDEN 포함). */
public record AdminProductListItem(
        Long id,
        String slug,
        String name,
        ProductCategory category,
        int price,
        ProductStatus status,
        int stockQuantity,
        String artisanName
) {
    public static AdminProductListItem from(Product p) {
        return new AdminProductListItem(
                p.getId(), p.getSlug(), p.getName(), p.getCategory(), p.getPrice(),
                p.getStatus(), p.getStockQuantity(), p.getArtisan().getName()
        );
    }
}
