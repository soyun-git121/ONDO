package kr.ondo.domain.order.service;

import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import kr.ondo.domain.order.dto.OrderCreateRequest;
import kr.ondo.domain.order.dto.OrderCreateResponse;
import kr.ondo.domain.order.dto.OrderLookupResponse;
import kr.ondo.domain.order.entity.Order;
import kr.ondo.domain.order.entity.OrderItem;
import kr.ondo.domain.order.exception.OrderErrorCode;
import kr.ondo.domain.order.repository.OrderRepository;
import kr.ondo.domain.product.entity.Product;
import kr.ondo.domain.product.entity.ProductStatus;
import kr.ondo.domain.product.exception.ProductErrorCode;
import kr.ondo.domain.product.repository.ProductRepository;
import kr.ondo.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 주문 도메인 서비스. api.md §4 / architecture.md §3.3.
 * 실결제 없음: PENDING 생성까지만. 서버가 가격 재계산 → 재고 조건부 차감 → 스냅샷 저장.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class OrderService {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final char[] CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".toCharArray();
    private static final SecureRandom RANDOM = new SecureRandom();

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderCreateResponse createOrder(OrderCreateRequest request) {
        Order order = Order.pending(
                generateOrderNumber(), request.ordererName(), request.phone(), request.email(),
                request.zipcode(), request.address(), request.addressDetail(), request.memo()
        );

        for (OrderCreateRequest.Item item : request.items()) {
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new BusinessException(ProductErrorCode.PRODUCT_NOT_FOUND));

            // 구매 가능 상태만 허용 (INQUIRY_ONLY/HIDDEN은 주문 불가, SOLD_OUT은 재고 부족)
            if (product.getStatus() == ProductStatus.INQUIRY_ONLY
                    || product.getStatus() == ProductStatus.HIDDEN) {
                throw new BusinessException(OrderErrorCode.NOT_PURCHASABLE,
                        "구매할 수 없는 상품입니다: " + product.getName());
            }

            // 재고 조건부 차감 — 부족하면 0행 → OUT_OF_STOCK (동시성 안전)
            int updated = productRepository.decreaseStock(product.getId(), item.quantity());
            if (updated == 0) {
                throw new BusinessException(OrderErrorCode.OUT_OF_STOCK,
                        "재고가 부족합니다: " + product.getName());
            }

            // 가격·이름은 서버 기준 스냅샷 (클라이언트 금액 신뢰 안 함)
            order.addItem(OrderItem.snapshot(
                    product.getId(), product.getName(), product.getArtisan().getName(),
                    product.getPrice(), item.quantity()
            ));
        }

        orderRepository.save(order);
        return OrderCreateResponse.from(order);
    }

    /** 비회원 주문 조회 — orderNumber + phone 둘 다 일치해야 반환(불일치 시 404). */
    public OrderLookupResponse getOrder(String orderNumber, String phone) {
        return orderRepository.findByOrderNumberAndPhone(orderNumber, phone)
                .map(OrderLookupResponse::from)
                .orElseThrow(() -> new BusinessException(OrderErrorCode.ORDER_NOT_FOUND));
    }

    /** ONDO-yyyyMMdd-XXXXXX (날짜 + 6자리 랜덤). 충돌 시 재생성. */
    private String generateOrderNumber() {
        String date = LocalDate.now().format(DATE);
        for (int attempt = 0; attempt < 5; attempt++) {
            String candidate = "ONDO-" + date + "-" + randomCode();
            if (!orderRepository.existsByOrderNumber(candidate)) {
                return candidate;
            }
        }
        // 극히 드문 연속 충돌 — 타임스탬프 접미사로 확정
        return "ONDO-" + date + "-" + randomCode() + (System.nanoTime() % 1000);
    }

    private String randomCode() {
        StringBuilder sb = new StringBuilder(6);
        for (int i = 0; i < 6; i++) {
            sb.append(CODE_CHARS[RANDOM.nextInt(CODE_CHARS.length)]);
        }
        return sb.toString();
    }
}
