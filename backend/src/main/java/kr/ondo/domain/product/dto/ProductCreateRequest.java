package kr.ondo.domain.product.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import kr.ondo.domain.product.entity.ProductCategory;
import kr.ondo.domain.product.entity.ProductStatus;
import kr.ondo.global.validation.SlugPattern;

/** POST /api/admin/products 요청. api.md §8. */
public record ProductCreateRequest(
        @NotNull Long artisanId,
        @NotBlank @Pattern(regexp = SlugPattern.REGEXP, message = SlugPattern.MESSAGE) String slug,
        @NotBlank String name,
        @NotNull ProductCategory category,
        @Min(0) int price,
        String summary,
        String description,
        String thumbnailUrl,
        @Min(0) int stockQuantity,
        @NotNull ProductStatus status,
        String externalUrl,
        @Valid List<ImageRequest> images
) {
    public record ImageRequest(@NotBlank String imageUrl, String caption, int sortOrder) {
    }
}
