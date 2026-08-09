/** Product DTO — api.md §3과 1:1 */

export type ProductCategory = "ARTWORK" | "GIFT" | "GOODS";
export type ProductStatus = "ON_SALE" | "SOLD_OUT" | "INQUIRY_ONLY" | "HIDDEN";
export type ProductSort = "latest" | "priceAsc" | "priceDesc";

export const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, string> = {
  ARTWORK: "작품",
  GIFT: "선물",
  GOODS: "소품",
};

/** 관리자 화면 표기 — 공개 화면은 status를 노출하지 않는다. */
export const PRODUCT_STATUS_LABEL: Record<ProductStatus, string> = {
  ON_SALE: "판매중",
  SOLD_OUT: "품절",
  INQUIRY_ONLY: "문의 전용",
  HIDDEN: "숨김",
};

export const won = (v: number) => `${v.toLocaleString("ko-KR")}원`;

/**
 * 가격줄 문구 — status 하나에서 파생된다. Shop 목록과 상품 상세가 같은 규칙을 써야 한다.
 * INQUIRY_ONLY는 가격이 0으로 저장되므로 금액을 그대로 찍으면 "0원"이 되어 오해를 부른다.
 * (스타일은 화면마다 달라 여기서 정하지 않는다 — 문구만 정본으로 둔다.)
 */
export function priceText(p: { status: ProductStatus; price: number }): string {
  return p.status === "INQUIRY_ONLY" ? "주문 문의" : won(p.price);
}

/** GET /api/products content 항목 */
export interface ProductSummary {
  id: number;
  slug: string;
  name: string;
  price: number;
  category: ProductCategory;
  status: ProductStatus;
  summary: string | null;
  thumbnailUrl: string | null;
  artisanName: string;
  artisanSlug: string;
}

export interface ProductImage {
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

/** GET /api/products/{slug} */
export interface ProductDetail {
  id: number;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  status: ProductStatus;
  stockQuantity: number;
  summary: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  externalUrl: string | null;
  images: ProductImage[];
  artisan: {
    slug: string;
    name: string;
    title: string;
    profileImageUrl: string | null;
    shortIntro: string;
  };
}
