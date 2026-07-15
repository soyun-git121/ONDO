/** Product DTO — api.md §3과 1:1 */

export type ProductCategory = "ARTWORK" | "GIFT" | "GOODS";
export type ProductStatus = "ON_SALE" | "SOLD_OUT" | "INQUIRY_ONLY" | "HIDDEN";
export type ProductSort = "latest" | "priceAsc" | "priceDesc";

export const PRODUCT_CATEGORY_LABEL: Record<ProductCategory, string> = {
  ARTWORK: "작품",
  GIFT: "선물",
  GOODS: "소품",
};

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
