package kr.ondo.domain.order.service;

import java.util.Map;
import java.util.Set;
import kr.ondo.domain.order.dto.AdminOrderListItem;
import kr.ondo.domain.order.dto.AdminOrderResponse;
import kr.ondo.domain.order.dto.OrderStatusRequest;
import kr.ondo.domain.order.entity.Order;
import kr.ondo.domain.order.entity.OrderStatus;
import kr.ondo.domain.order.exception.OrderErrorCode;
import kr.ondo.domain.order.repository.OrderRepository;
import kr.ondo.domain.product.repository.ProductRepository;
import kr.ondo.global.exception.BusinessException;
import kr.ondo.global.exception.GlobalErrorCode;
import kr.ondo.global.response.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 관리자 주문 조회·상태 관리. api.md §8.
 * 전이 규칙: PENDING→PAID→PREPARING→SHIPPED→DELIVERED, 취소는 PENDING·PAID에서만.
 * 취소 시 재고 복원.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AdminOrderService {

    /** 허용 전이 맵. */
    private static final Map<OrderStatus, Set<OrderStatus>> ALLOWED = Map.of(
            OrderStatus.PENDING, Set.of(OrderStatus.PAID, OrderStatus.CANCELLED),
            OrderStatus.PAID, Set.of(OrderStatus.PREPARING, OrderStatus.CANCELLED),
            OrderStatus.PREPARING, Set.of(OrderStatus.SHIPPED),
            OrderStatus.SHIPPED, Set.of(OrderStatus.DELIVERED),
            OrderStatus.DELIVERED, Set.of(),
            OrderStatus.CANCELLED, Set.of()
    );

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public PageResponse<AdminOrderListItem> getList(int page, int size, String status) {
        Pageable pageable = PageRequest.of(Math.max(page, 0), size <= 0 ? 20 : Math.min(size, 100),
                Sort.by(Sort.Direction.DESC, "createdAt"));
        var result = (status == null || status.isBlank())
                ? orderRepository.findAll(pageable)
                : orderRepository.findByStatus(parseStatus(status), pageable);
        return PageResponse.of(result, AdminOrderListItem::from);
    }

    public AdminOrderResponse getOne(Long id) {
        return AdminOrderResponse.from(findOrThrow(id));
    }

    @Transactional
    public AdminOrderResponse changeStatus(Long id, OrderStatusRequest req) {
        Order order = findOrThrow(id);
        OrderStatus current = order.getStatus();
        OrderStatus next = req.status();

        if (next == current || !ALLOWED.getOrDefault(current, Set.of()).contains(next)) {
            throw new BusinessException(OrderErrorCode.INVALID_STATUS_TRANSITION,
                    current + " → " + next + " 전이는 허용되지 않습니다.");
        }

        // 상태를 먼저 변경(dirty)한 뒤 취소 시 재고 복원.
        // increaseStock의 flushAutomatically가 상태 변경까지 DB에 반영한다.
        order.changeStatus(next);
        if (next == OrderStatus.CANCELLED) {
            order.getItems().forEach(item -> {
                if (item.getProductId() != null) {
                    productRepository.increaseStock(item.getProductId(), item.getQuantity());
                }
            });
        }
        return AdminOrderResponse.from(order);
    }

    private Order findOrThrow(Long id) {
        return orderRepository.findWithItemsById(id)
                .orElseThrow(() -> new BusinessException(OrderErrorCode.ORDER_NOT_FOUND));
    }

    private OrderStatus parseStatus(String raw) {
        try {
            return OrderStatus.valueOf(raw.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new BusinessException(GlobalErrorCode.INVALID_INPUT, "지원하지 않는 status: " + raw);
        }
    }
}
