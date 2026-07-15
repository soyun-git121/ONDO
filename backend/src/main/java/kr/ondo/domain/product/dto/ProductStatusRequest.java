package kr.ondo.domain.product.dto;

import jakarta.validation.constraints.NotNull;
import kr.ondo.domain.product.entity.ProductStatus;

/** PATCH /api/admin/products/{id}/status 요청. */
public record ProductStatusRequest(@NotNull ProductStatus status) {
}
