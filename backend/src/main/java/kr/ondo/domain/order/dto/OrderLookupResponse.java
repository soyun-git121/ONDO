package kr.ondo.domain.order.dto;

import java.time.LocalDateTime;
import java.util.List;
import kr.ondo.domain.order.entity.Order;
import kr.ondo.domain.order.entity.OrderStatus;

/**
 * GET /api/orders/{orderNumber}?phone= 응답. api.md §4.
 */
public record OrderLookupResponse(
        String orderNumber,
        OrderStatus status,
        String ordererName,
        int totalAmount,
        LocalDateTime createdAt,
        List<Item> items
) {
    public record Item(String productName, String artisanName, int price, int quantity) {
    }

    public static OrderLookupResponse from(Order o) {
        List<Item> items = o.getItems().stream()
                .map(i -> new Item(i.getProductName(), i.getArtisanName(), i.getPrice(), i.getQuantity()))
                .toList();
        return new OrderLookupResponse(
                o.getOrderNumber(), o.getStatus(), o.getOrdererName(),
                o.getTotalAmount(), o.getCreatedAt(), items
        );
    }
}
