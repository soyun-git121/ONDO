package kr.ondo.domain.product.entity;

/**
 * 상품 판매 상태. api.md Enum / db_schema.md §3.
 * INQUIRY_ONLY: 고가 작품 건별 협의 → 프론트는 구매 대신 협업문의로 연결.
 * HIDDEN: 공개 목록/상세에서 제외.
 */
public enum ProductStatus {
    ON_SALE,
    SOLD_OUT,
    INQUIRY_ONLY,
    HIDDEN
}
