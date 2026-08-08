/**
 * 관리자 API DTO — 백엔드 kr.ondo.domain.*.dto의 Admin* 레코드와 1:1 (api.md §8).
 * 공개 DTO(types/artisan.ts 등)와 필드가 다르므로 분리한다 — 관리자는 비공개 필드까지 다룬다.
 */

import type { Designation } from "./artisan";
import type { InquiryType } from "./inquiry";
import type { NewsCategory, NewsType } from "./news";
import type { OrderStatus } from "./order";
import type { ProductCategory, ProductStatus } from "./product";
import type { ProjectType } from "./project";

/* ---------- 인증 ---------- */

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  expiresIn: number;
}

/* ---------- 공통 ---------- */

/** 이미지 갤러리 항목 — 보유자·상품·실적이 같은 구조를 쓴다. */
export interface AdminImageItem {
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

export interface UploadResponse {
  url: string;
}

/* ---------- 보유자 ---------- */

export interface AdminArtisanListItem {
  id: number;
  slug: string;
  name: string;
  title: string;
  designation: Designation;
  displayOrder: number;
  published: boolean;
}

export interface AdminArtisanResponse {
  id: number;
  slug: string;
  name: string;
  title: string;
  designation: Designation;
  shortIntro: string;
  story: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  videoUrl: string | null;
  snsLinks: Record<string, string>;
  displayOrder: number;
  published: boolean;
  images: AdminImageItem[];
}

export interface ArtisanCreateRequest {
  slug: string;
  name: string;
  title: string;
  designation: Designation;
  shortIntro: string;
  story: string | null;
  profileImageUrl: string | null;
  coverImageUrl: string | null;
  videoUrl: string | null;
  snsLinks: Record<string, string>;
  displayOrder: number;
  published: boolean;
  images: AdminImageItem[];
}

/** slug는 식별자라 수정 불가 — 요청에서 빠진다. */
export type ArtisanUpdateRequest = Omit<ArtisanCreateRequest, "slug">;

/* ---------- 상품 ---------- */

export interface AdminProductListItem {
  id: number;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  status: ProductStatus;
  stockQuantity: number;
  artisanName: string;
}

export interface AdminProductResponse {
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
  artisanId: number;
  artisanName: string;
  images: AdminImageItem[];
}

export interface ProductCreateRequest {
  artisanId: number;
  slug: string;
  name: string;
  category: ProductCategory;
  price: number;
  summary: string | null;
  description: string | null;
  thumbnailUrl: string | null;
  stockQuantity: number;
  status: ProductStatus;
  externalUrl: string | null;
  images: AdminImageItem[];
}

export type ProductUpdateRequest = Omit<ProductCreateRequest, "slug">;

/* ---------- 뉴스 ---------- */

export interface AdminNewsListItem {
  id: number;
  title: string;
  type: NewsType;
  category: NewsCategory;
  published: boolean;
  publishedAt: string | null;
}

export interface AdminNewsResponse {
  id: number;
  title: string;
  thumbnailUrl: string | null;
  type: NewsType;
  content: string | null;
  externalUrl: string | null;
  sourceName: string | null;
  category: NewsCategory;
  artisanId: number | null;
  published: boolean;
  publishedAt: string | null;
}

export interface NewsCreateRequest {
  title: string;
  thumbnailUrl: string | null;
  type: NewsType;
  content: string | null;
  externalUrl: string | null;
  sourceName: string | null;
  category: NewsCategory;
  artisanId: number | null;
  published: boolean;
  publishedAt: string | null;
}

/** published는 PATCH /publish로 별도 관리 — 수정 요청에는 없다. */
export type NewsUpdateRequest = Omit<NewsCreateRequest, "published">;

/* ---------- 협업 실적 ---------- */

export interface AdminProjectListItem {
  id: number;
  slug: string;
  title: string;
  type: ProjectType;
  clientName: string | null;
  projectDate: string;
  featured: boolean;
  published: boolean;
}

export interface AdminProjectArtisanItem {
  artisanId: number;
  name: string;
  role: string | null;
}

export interface AdminProjectResponse {
  id: number;
  slug: string;
  title: string;
  type: ProjectType;
  clientName: string | null;
  summary: string | null;
  description: string | null;
  resultMetric: string | null;
  thumbnailUrl: string | null;
  projectDate: string;
  featured: boolean;
  displayOrder: number;
  published: boolean;
  images: AdminImageItem[];
  artisans: AdminProjectArtisanItem[];
}

export interface ProjectCreateRequest {
  slug: string;
  title: string;
  type: ProjectType;
  clientName: string | null;
  summary: string | null;
  description: string | null;
  resultMetric: string | null;
  thumbnailUrl: string | null;
  projectDate: string;
  /** 백엔드 필드명이 isFeatured — 응답의 featured와 이름이 다르니 주의. */
  isFeatured: boolean;
  displayOrder: number;
  published: boolean;
  images: AdminImageItem[];
  artisans: { artisanId: number; role: string | null }[];
}

export type ProjectUpdateRequest = Omit<ProjectCreateRequest, "slug">;

/* ---------- 문의 ---------- */

export type InquiryStatus = "NEW" | "IN_REVIEW" | "REPLIED" | "CLOSED";

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  NEW: "신규",
  IN_REVIEW: "검토 중",
  REPLIED: "회신 완료",
  CLOSED: "종료",
};

export interface AdminInquiryResponse {
  id: number;
  type: InquiryType;
  companyName: string | null;
  contactName: string;
  email: string;
  phone: string | null;
  message: string;
  status: InquiryStatus;
  adminNote: string | null;
  createdAt: string;
}

export interface InquiryUpdateRequest {
  status: InquiryStatus;
  adminNote: string | null;
}

/* ---------- 주문 ---------- */

export interface AdminOrderListItem {
  id: number;
  orderNumber: string;
  ordererName: string;
  phone: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface AdminOrderItem {
  productId: number | null;
  productName: string;
  artisanName: string;
  price: number;
  quantity: number;
}

export interface AdminOrderResponse {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  ordererName: string;
  phone: string;
  email: string | null;
  zipcode: string;
  address: string;
  addressDetail: string | null;
  memo: string | null;
  totalAmount: number;
  paidAt: string | null;
  createdAt: string;
  items: AdminOrderItem[];
  /**
   * 지금 상태에서 넘어갈 수 있는 상태들 — 서버(OrderStatus.allowedNextStatuses)가 계산해 내려준다.
   * 전이 규칙을 프론트에 복제하지 않으려는 것이므로 여기서 다시 판단하지 말 것.
   */
  allowedNextStatuses: OrderStatus[];
}
