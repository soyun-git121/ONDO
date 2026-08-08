package kr.ondo.domain.order.entity;

import java.util.List;
import java.util.Set;

/**
 * 주문 상태. api.md Enum / db_schema.md §5.
 * 전이: PENDING → PAID → PREPARING → SHIPPED → DELIVERED (취소는 PENDING·PAID에서만).
 * PAID 전이는 PG 연동(Phase 4) 전까지 admin 수동 처리.
 *
 * <p>전이 규칙은 여기가 단일 출처다. 서비스의 검증도, 관리자 화면이 노출하는 버튼도
 * 모두 이 값을 따른다 — 규칙을 한 곳에서만 고치면 되도록.
 */
public enum OrderStatus {
    PENDING,
    PAID,
    PREPARING,
    SHIPPED,
    DELIVERED,
    CANCELLED;

    /**
     * 이 상태에서 넘어갈 수 있는 상태들. 순서는 관리자 화면에 버튼이 놓이는 순서다.
     * enum 상수의 정적 필드는 초기화 순서 문제가 있어 switch로 둔다.
     */
    public List<OrderStatus> allowedNextStatuses() {
        return switch (this) {
            case PENDING -> List.of(PAID, CANCELLED);
            case PAID -> List.of(PREPARING, CANCELLED);
            case PREPARING -> List.of(SHIPPED);
            case SHIPPED -> List.of(DELIVERED);
            case DELIVERED, CANCELLED -> List.of();
        };
    }

    /** 같은 상태로의 전이도 허용하지 않는다(변경 없는 요청은 잘못된 호출로 본다). */
    public boolean canTransitionTo(OrderStatus next) {
        return Set.copyOf(allowedNextStatuses()).contains(next);
    }
}
