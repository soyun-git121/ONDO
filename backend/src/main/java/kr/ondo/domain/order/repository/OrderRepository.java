package kr.ondo.domain.order.repository;

import java.util.Optional;
import kr.ondo.domain.order.entity.Order;
import kr.ondo.domain.order.entity.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByOrderNumber(String orderNumber);

    /** 비회원 조회 — orderNumber + phone 둘 다 일치해야 반환 (api.md §4). */
    @EntityGraph(attributePaths = "items")
    Optional<Order> findByOrderNumberAndPhone(String orderNumber, String phone);

    /** admin 목록 — 상태 필터. */
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    /** admin 상세 — 주문 상품 함께 로드. */
    @EntityGraph(attributePaths = "items")
    Optional<Order> findWithItemsById(Long id);
}
