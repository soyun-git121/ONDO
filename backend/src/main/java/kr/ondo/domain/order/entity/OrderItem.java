package kr.ondo.domain.order.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 주문 상품 (스냅샷). db_schema.md §6.
 * product_id는 nullable(상품 삭제돼도 주문 기록 보존) — FK 엔티티 대신 id만 보관.
 * product_name·artisan_name·price는 주문 시점 스냅샷 (정산 근거).
 */
@Entity
@Getter
@Table(name = "order_item", indexes = {
        @Index(name = "idx_oi_order", columnList = "order_id"),
        @Index(name = "idx_oi_product", columnList = "product_id")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "product_id")
    private Long productId; // 상품 삭제 시 null 가능

    @Column(name = "product_name", nullable = false, length = 100)
    private String productName;

    @Column(name = "artisan_name", nullable = false, length = 50)
    private String artisanName;

    @Column(nullable = false)
    private int price; // 주문 시점 가격 스냅샷

    @Column(nullable = false)
    private int quantity;

    private OrderItem(Long productId, String productName, String artisanName, int price, int quantity) {
        this.productId = productId;
        this.productName = productName;
        this.artisanName = artisanName;
        this.price = price;
        this.quantity = quantity;
    }

    /** 주문 시점 스냅샷으로 생성. */
    public static OrderItem snapshot(Long productId, String productName, String artisanName,
                                     int price, int quantity) {
        return new OrderItem(productId, productName, artisanName, price, quantity);
    }

    void assignOrder(Order order) {
        this.order = order;
    }

    public int lineAmount() {
        return price * quantity;
    }
}
