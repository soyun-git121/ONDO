import { get } from "./client";
import type { PageResponse } from "../types/common";
import type {
  ProductCategory,
  ProductDetail,
  ProductSort,
  ProductSummary,
} from "../types/product";

export function getProducts(params: {
  page?: number;
  size?: number;
  artisan?: string;
  category?: ProductCategory;
  sort?: ProductSort;
}): Promise<PageResponse<ProductSummary>> {
  return get<PageResponse<ProductSummary>>("/products", params);
}

export function getProduct(slug: string): Promise<ProductDetail> {
  return get<ProductDetail>(`/products/${slug}`);
}
