package kr.ondo.domain.product.entity;

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
import kr.ondo.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 상품 상세 이미지. db_schema.md §4 (artisan_image와 동일 구조).
 */
@Entity
@Getter
@Table(name = "product_image", indexes = {
        @Index(name = "idx_pi_product", columnList = "product_id, sort_order")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class ProductImage extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "image_url", nullable = false, length = 500)
    private String imageUrl;

    @Column(length = 200)
    private String caption;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @Builder
    private ProductImage(String imageUrl, String caption, int sortOrder) {
        this.imageUrl = imageUrl;
        this.caption = caption;
        this.sortOrder = sortOrder;
    }

    void assignProduct(Product product) {
        this.product = product;
    }
}
