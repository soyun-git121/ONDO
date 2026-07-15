package kr.ondo.domain.order.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import kr.ondo.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 주문(Order) — `order`는 예약어라 테이블명 복수형. db_schema.md §5 / api.md §4.
 * 실결제 없음: PENDING으로 생성 후 입금 안내까지만. PAID 전이는 admin 수동(Phase 4 PG 전).
 */
@Entity
@Getter
@Table(name = "orders", indexes = {
        @Index(name = "idx_order_lookup", columnList = "order_number, phone"),
        @Index(name = "idx_order_status", columnList = "status, created_at")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Order extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", unique = true, nullable = false, length = 30)
    private String orderNumber;

    @Column(name = "orderer_name", nullable = false, length = 50)
    private String ordererName;

    @Column(nullable = false, length = 20)
    private String phone; // 비회원 주문 조회 키

    @Column(length = 100)
    private String email;

    @Column(nullable = false, length = 10)
    private String zipcode;

    @Column(nullable = false, length = 300)
    private String address;

    @Column(name = "address_detail", length = 200)
    private String addressDetail;

    @Column(length = 300)
    private String memo;

    @Column(name = "total_amount", nullable = false)
    private int totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(name = "paid_at")
    private LocalDateTime paidAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    private Order(String orderNumber, String ordererName, String phone, String email, String zipcode,
                  String address, String addressDetail, String memo) {
        this.orderNumber = orderNumber;
        this.ordererName = ordererName;
        this.phone = phone;
        this.email = email;
        this.zipcode = zipcode;
        this.address = address;
        this.addressDetail = addressDetail;
        this.memo = memo;
        this.totalAmount = 0;
        this.status = OrderStatus.PENDING;
    }

    /** 결제 대기(PENDING) 주문 생성. 금액은 addItem으로 누적된다. */
    public static Order pending(String orderNumber, String ordererName, String phone, String email,
                                String zipcode, String address, String addressDetail, String memo) {
        return new Order(orderNumber, ordererName, phone, email, zipcode, address, addressDetail, memo);
    }

    public void addItem(OrderItem item) {
        items.add(item);
        item.assignOrder(this);
        this.totalAmount += item.lineAmount();
    }

    /** 입금 확인(admin 수동, Phase 4 PG 전) — PENDING → PAID. */
    public void markPaid() {
        this.status = OrderStatus.PAID;
        this.paidAt = LocalDateTime.now();
    }

    /** 상태 전이 (전이 규칙 검증은 서비스에서). PAID 전이 시 paidAt 기록. */
    public void changeStatus(OrderStatus newStatus) {
        if (newStatus == OrderStatus.PAID) {
            markPaid();
        } else {
            this.status = newStatus;
        }
    }
}
