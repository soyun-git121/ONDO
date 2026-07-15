package kr.ondo.domain.product.entity;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;
import kr.ondo.domain.artisan.entity.Artisan;
import kr.ondo.global.entity.BaseTimeEntity;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 상품(Product) — 보유자에 종속. db_schema.md §3 / api.md §3.
 * setter 금지 — 변경 메서드만 (예: soldOut()). claude.md 컨벤션.
 */
@Entity
@Getter
@Table(name = "product", indexes = {
        @Index(name = "idx_product_artisan", columnList = "artisan_id, status"),
        @Index(name = "idx_product_list", columnList = "status, category, created_at")
})
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Product extends BaseTimeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "artisan_id", nullable = false)
    private Artisan artisan; // 상품은 반드시 보유자 소속

    @Column(unique = true, nullable = false, length = 100)
    private String slug;

    @Column(nullable = false, length = 100)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductCategory category;

    @Column(nullable = false)
    private int price; // INQUIRY_ONLY면 0 허용

    @Column(length = 300)
    private String summary;

    @Column(columnDefinition = "TEXT")
    private String description; // 마크다운

    @Column(name = "thumbnail_url", length = 500)
    private String thumbnailUrl;

    @Column(name = "stock_quantity", nullable = false)
    private int stockQuantity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProductStatus status;

    @Column(name = "external_url", length = 500)
    private String externalUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder ASC")
    private List<ProductImage> images = new ArrayList<>();

    @Builder
    private Product(Artisan artisan, String slug, String name, ProductCategory category, int price,
                    String summary, String description, String thumbnailUrl, int stockQuantity,
                    ProductStatus status, String externalUrl) {
        this.artisan = artisan;
        this.slug = slug;
        this.name = name;
        this.category = category;
        this.price = price;
        this.summary = summary;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.stockQuantity = stockQuantity;
        this.status = status;
        this.externalUrl = externalUrl;
    }

    public void addImage(ProductImage image) {
        images.add(image);
        image.assignProduct(this);
    }

    /** 품절 처리 — 상태 변경 메서드 (claude.md 예시). */
    public void soldOut() {
        this.status = ProductStatus.SOLD_OUT;
    }

    /** admin 수정 — slug 불변. 보유자 재지정 가능. */
    public void update(Artisan artisan, String name, ProductCategory category, int price,
                       String summary, String description, String thumbnailUrl, int stockQuantity,
                       ProductStatus status, String externalUrl) {
        this.artisan = artisan;
        this.name = name;
        this.category = category;
        this.price = price;
        this.summary = summary;
        this.description = description;
        this.thumbnailUrl = thumbnailUrl;
        this.stockQuantity = stockQuantity;
        this.status = status;
        this.externalUrl = externalUrl;
    }

    public void changeStatus(ProductStatus status) {
        this.status = status;
    }

    public void replaceImages(List<ProductImage> newImages) {
        images.clear();
        newImages.forEach(this::addImage);
    }
}
