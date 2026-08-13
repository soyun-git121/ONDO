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

/**
 * PUT /api/admin/products/{id} 요청.
 *
 * <p>slug는 원래 불변이었다. 잘못 저장된 값을 admin이 고칠 방법이 없어 열었다(V3 참고).
 * 바꾸면 공개 URL이 바뀌어 기존에 공유된 링크가 404가 되므로, 화면에서 그 점을 경고한다.
 */
public record ProductUpdateRequest(
        @NotBlank @Pattern(regexp = SlugPattern.REGEXP, message = SlugPattern.MESSAGE) String slug,
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
