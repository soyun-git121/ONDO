package kr.ondo.domain.order.dto;

import java.time.LocalDateTime;
import kr.ondo.domain.order.entity.Order;
import kr.ondo.domain.order.entity.OrderStatus;

/** 관리자 주문 목록 항목. api.md §8. */
public record AdminOrderListItem(
        Long id,
        String orderNumber,
        String ordererName,
        String phone,
        int totalAmount,
        OrderStatus status,
        LocalDateTime createdAt
) {
    public static AdminOrderListItem from(Order o) {
        return new AdminOrderListItem(
                o.getId(), o.getOrderNumber(), o.getOrdererName(), o.getPhone(),
                o.getTotalAmount(), o.getStatus(), o.getCreatedAt()
        );
    }
}
