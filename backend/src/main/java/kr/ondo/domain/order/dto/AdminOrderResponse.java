package kr.ondo.domain.order.dto;

import java.time.LocalDateTime;
import java.util.List;
import kr.ondo.domain.order.entity.Order;
import kr.ondo.domain.order.entity.OrderStatus;

/** 관리자 주문 상세 (주문자·배송지·상품 스냅샷). api.md §8. */
public record AdminOrderResponse(
        Long id,
        String orderNumber,
        OrderStatus status,
        String ordererName,
        String phone,
        String email,
        String zipcode,
        String address,
        String addressDetail,
        String memo,
        int totalAmount,
        LocalDateTime paidAt,
        LocalDateTime createdAt,
        List<Item> items
) {
    public record Item(Long productId, String productName, String artisanName, int price, int quantity) {
    }

    public static AdminOrderResponse from(Order o) {
        List<Item> items = o.getItems().stream()
                .map(i -> new Item(i.getProductId(), i.getProductName(), i.getArtisanName(),
                        i.getPrice(), i.getQuantity()))
                .toList();
        return new AdminOrderResponse(
                o.getId(), o.getOrderNumber(), o.getStatus(), o.getOrdererName(), o.getPhone(),
                o.getEmail(), o.getZipcode(), o.getAddress(), o.getAddressDetail(), o.getMemo(),
                o.getTotalAmount(), o.getPaidAt(), o.getCreatedAt(), items
        );
    }
}
