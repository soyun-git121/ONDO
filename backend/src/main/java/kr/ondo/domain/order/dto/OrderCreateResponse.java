package kr.ondo.domain.order.dto;

import kr.ondo.domain.order.entity.Order;
import kr.ondo.domain.order.entity.OrderStatus;

/**
 * POST /api/orders 응답 (201). api.md §4.
 */
public record OrderCreateResponse(
        String orderNumber,
        int totalAmount,
        OrderStatus status
) {
    public static OrderCreateResponse from(Order o) {
        return new OrderCreateResponse(o.getOrderNumber(), o.getTotalAmount(), o.getStatus());
    }
}
