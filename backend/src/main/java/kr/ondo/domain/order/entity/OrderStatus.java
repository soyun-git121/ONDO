package kr.ondo.domain.order.entity;

/**
 * 주문 상태. api.md Enum / db_schema.md §5.
 * 전이: PENDING → PAID → PREPARING → SHIPPED → DELIVERED (취소는 PENDING·PAID에서만).
 * PAID 전이는 PG 연동(Phase 4) 전까지 admin 수동 처리.
 */
public enum OrderStatus {
    PENDING,
    PAID,
    PREPARING,
    SHIPPED,
    DELIVERED,
    CANCELLED
}
