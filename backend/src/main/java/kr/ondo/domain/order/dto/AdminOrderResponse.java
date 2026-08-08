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
        List<Item> items,
        /**
         * 지금 상태에서 넘어갈 수 있는 상태들. 관리자 화면은 이 값으로 버튼을 그린다 —
         * 전이 규칙을 프론트에 복제하지 않기 위해 서버가 내려준다.
         */
        List<OrderStatus> allowedNextStatuses
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
                o.getTotalAmount(), o.getPaidAt(), o.getCreatedAt(), items,
                o.getStatus().allowedNextStatuses()
        );
    }
}
