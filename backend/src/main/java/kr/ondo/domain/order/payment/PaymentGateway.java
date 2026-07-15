package kr.ondo.domain.order.payment;

/**
 * 결제 게이트웨이 시임. 주문 생성과 결제 승인을 처음부터 분리 (architecture.md §7).
 *
 * 현재(Phase 1~3): 실결제 금지 — 주문은 PENDING까지만 생성하고 이 인터페이스는 호출하지 않는다.
 * Phase 4: 이 인터페이스의 구현체만 토스페이먼츠로 교체하면 Order 코드 변경 없이 PAID 전이 가능.
 */
public interface PaymentGateway {

    PaymentResult approve(String orderNumber, int amount);

    record PaymentResult(boolean approved, String paymentKey, String message) {
    }
}
