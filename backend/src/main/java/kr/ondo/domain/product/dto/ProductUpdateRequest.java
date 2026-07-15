package kr.ondo.domain.product.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;
import kr.ondo.domain.product.entity.ProductCategory;
import kr.ondo.domain.product.entity.ProductStatus;

/** PUT /api/admin/products/{id} 요청. slug 불변. */
public record ProductUpdateRequest(
        @NotNull Long artisanId,
        @NotBlank String name,
        @NotNull ProductCategory category,
        @Min(0) int price,
        String summary,
        String description,
        String thumbnailUrl,
        @Min(0) int stockQuantity,
        @NotNull ProductStatus status,
        String externalUrl,
        @Valid List<ProductCreateRequest.ImageRequest> images
) {
}
