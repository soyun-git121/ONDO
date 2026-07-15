package kr.ondo.domain.order.payment;

import org.springframework.stereotype.Component;

/**
 * 실결제 미연동 Mock 구현 (claude.md: PG 호출부는 인터페이스 + Mock).
 * 현재 결제 플로우에서는 호출되지 않는다 — 무통장 입금 안내로 대체.
 * Phase 4에서 TossPaymentGateway로 교체.
 */
@Component
public class MockPaymentGateway implements PaymentGateway {

    @Override
    public PaymentResult approve(String orderNumber, int amount) {
        return new PaymentResult(false, null, "실결제 미연동 — 무통장 입금 안내로 대체됩니다.");
    }
}
