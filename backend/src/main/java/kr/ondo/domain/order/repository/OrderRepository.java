package kr.ondo.domain.order.repository;

import java.util.Optional;
import kr.ondo.domain.order.entity.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {

    boolean existsByOrderNumber(String orderNumber);

    /** 비회원 조회 — orderNumber + phone 둘 다 일치해야 반환 (api.md §4). */
    @EntityGraph(attributePaths = "items")
    Optional<Order> findByOrderNumberAndPhone(String orderNumber, String phone);
}
