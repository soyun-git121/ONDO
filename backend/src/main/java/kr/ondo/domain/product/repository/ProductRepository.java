package kr.ondo.domain.product.repository;

import java.util.List;
import java.util.Optional;
import kr.ondo.domain.product.entity.Product;
import kr.ondo.domain.product.entity.ProductCategory;
import kr.ondo.domain.product.entity.ProductStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * 공개 상품 조회. HIDDEN 제외 (api.md §3).
 */
public interface ProductRepository extends JpaRepository<Product, Long> {

    /** 목록 — 보유자(slug)·카테고리 필터. 정렬은 Pageable로. artisan 페치조인(N+1 방지). */
    @Query(value = """
            select p from Product p join fetch p.artisan a
            where p.status <> :hidden
              and (:artisanSlug is null or a.slug = :artisanSlug)
              and (:category is null or p.category = :category)
            """,
            countQuery = """
            select count(p) from Product p
            where p.status <> :hidden
              and (:artisanSlug is null or p.artisan.slug = :artisanSlug)
              and (:category is null or p.category = :category)
            """)
    Page<Product> search(@Param("hidden") ProductStatus hidden,
                         @Param("artisanSlug") String artisanSlug,
                         @Param("category") ProductCategory category,
                         Pageable pageable);

    /** 상세 — HIDDEN 제외, 이미지+보유자 함께 로드. */
    @EntityGraph(attributePaths = {"images", "artisan"})
    Optional<Product> findBySlugAndStatusNot(String slug, ProductStatus status);

    boolean existsBySlug(String slug);

    /** admin 상세 — 상태 무관, 이미지+보유자 로드. */
    @EntityGraph(attributePaths = {"images", "artisan"})
    Optional<Product> findWithDetailsById(Long id);

    /** 주문 취소 시 재고 복원. */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Product p set p.stockQuantity = p.stockQuantity + :qty where p.id = :id")
    int increaseStock(@Param("id") Long id, @Param("qty") int qty);

    /** 보유자 랜딩용 — HIDDEN 제외 최신순 (api.md §2: 최신 8개). */
    @Query("select p from Product p where p.artisan.id = :artisanId and p.status <> :hidden order by p.createdAt desc")
    List<Product> findByArtisanForLanding(@Param("artisanId") Long artisanId,
                                          @Param("hidden") ProductStatus hidden,
                                          Pageable pageable);

    /**
     * 재고 조건부 차감 — 동시성 안전(db_schema.md 운영 노트).
     * 재고가 충분할 때만 차감되고, 영향받은 행 수(0 또는 1)를 반환한다.
     */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Product p set p.stockQuantity = p.stockQuantity - :qty "
            + "where p.id = :id and p.stockQuantity >= :qty")
    int decreaseStock(@Param("id") Long id, @Param("qty") int qty);
}
