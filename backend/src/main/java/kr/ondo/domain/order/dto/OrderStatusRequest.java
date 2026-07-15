package kr.ondo.domain.order.dto;

import jakarta.validation.constraints.NotNull;
import kr.ondo.domain.order.entity.OrderStatus;

/** PATCH /api/admin/orders/{id}/status 요청. api.md §8. */
public record OrderStatusRequest(@NotNull OrderStatus status) {
}
