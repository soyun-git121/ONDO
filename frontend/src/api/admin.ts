/**
 * 관리자 API — 전부 JWT 필요 (로그인 제외). api.md §8.
 * 공개 API(products.ts 등)와 분리해 둔다: 응답 DTO가 다르고 인증 요구가 다르다.
 */

import { del, get, patch, post, postFile, put } from "./client";
import type { PageResponse } from "../types/common";
import type {
  AdminArtisanListItem,
  AdminArtisanResponse,
  AdminInquiryResponse,
  AdminNewsListItem,
  AdminNewsResponse,
  AdminOrderListItem,
  AdminOrderResponse,
  AdminProductListItem,
  AdminProductResponse,
  AdminProjectListItem,
  AdminProjectResponse,
  ArtisanCreateRequest,
  ArtisanUpdateRequest,
  InquiryStatus,
  InquiryUpdateRequest,
  LoginRequest,
  LoginResponse,
  NewsCreateRequest,
  NewsUpdateRequest,
  ProductCreateRequest,
  ProductUpdateRequest,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  UploadResponse,
} from "../types/admin";
import type { InquiryType } from "../types/inquiry";
import type { OrderStatus } from "../types/order";
import type { ProductStatus } from "../types/product";

interface PageParams {
  page?: number;
  size?: number;
}

/* ---------- 인증 ---------- */

export function login(body: LoginRequest): Promise<LoginResponse> {
  return post<LoginResponse>("/admin/auth/login", body);
}

/* ---------- 업로드 ---------- */

export function uploadImage(file: File): Promise<UploadResponse> {
  return postFile<UploadResponse>("/admin/uploads", file);
}

/* ---------- 보유자 ---------- */

export const adminArtisans = {
  list: (params: PageParams) =>
    get<PageResponse<AdminArtisanListItem>>("/admin/artisans", params),
  get: (id: number) => get<AdminArtisanResponse>(`/admin/artisans/${id}`),
  create: (body: ArtisanCreateRequest) =>
    post<AdminArtisanResponse>("/admin/artisans", body),
  update: (id: number, body: ArtisanUpdateRequest) =>
    put<AdminArtisanResponse>(`/admin/artisans/${id}`, body),
  remove: (id: number) => del(`/admin/artisans/${id}`),
};

/* ---------- 상품 ---------- */

export const adminProducts = {
  list: (params: PageParams) =>
    get<PageResponse<AdminProductListItem>>("/admin/products", params),
  get: (id: number) => get<AdminProductResponse>(`/admin/products/${id}`),
  create: (body: ProductCreateRequest) =>
    post<AdminProductResponse>("/admin/products", body),
  update: (id: number, body: ProductUpdateRequest) =>
    put<AdminProductResponse>(`/admin/products/${id}`, body),
  changeStatus: (id: number, status: ProductStatus) =>
    patch<AdminProductResponse>(`/admin/products/${id}/status`, { status }),
  remove: (id: number) => del(`/admin/products/${id}`),
};

/* ---------- 뉴스 ---------- */

export const adminNews = {
  list: (params: PageParams) => get<PageResponse<AdminNewsListItem>>("/admin/news", params),
  get: (id: number) => get<AdminNewsResponse>(`/admin/news/${id}`),
  create: (body: NewsCreateRequest) => post<AdminNewsResponse>("/admin/news", body),
  update: (id: number, body: NewsUpdateRequest) =>
    put<AdminNewsResponse>(`/admin/news/${id}`, body),
  setPublish: (id: number, published: boolean) =>
    patch<AdminNewsResponse>(`/admin/news/${id}/publish`, { published }),
  remove: (id: number) => del(`/admin/news/${id}`),
  /** 네이버 뉴스 검색으로 CURATED 기사 가져오기 — 가져온 건수를 반환한다. */
  importFromNaver: (query: string, display: number) =>
    post<number>(`/admin/news/import?query=${encodeURIComponent(query)}&display=${display}`),
};

/* ---------- 협업 실적 ---------- */

export const adminProjects = {
  list: (params: PageParams) =>
    get<PageResponse<AdminProjectListItem>>("/admin/projects", params),
  get: (id: number) => get<AdminProjectResponse>(`/admin/projects/${id}`),
  create: (body: ProjectCreateRequest) =>
    post<AdminProjectResponse>("/admin/projects", body),
  update: (id: number, body: ProjectUpdateRequest) =>
    put<AdminProjectResponse>(`/admin/projects/${id}`, body),
  remove: (id: number) => del(`/admin/projects/${id}`),
};

/* ---------- 문의 ---------- */

export const adminInquiries = {
  list: (params: PageParams & { status?: InquiryStatus; type?: InquiryType }) =>
    get<PageResponse<AdminInquiryResponse>>("/admin/inquiries", params),
  get: (id: number) => get<AdminInquiryResponse>(`/admin/inquiries/${id}`),
  update: (id: number, body: InquiryUpdateRequest) =>
    patch<AdminInquiryResponse>(`/admin/inquiries/${id}`, body),
};

/* ---------- 주문 ---------- */

export const adminOrders = {
  list: (params: PageParams & { status?: OrderStatus }) =>
    get<PageResponse<AdminOrderListItem>>("/admin/orders", params),
  get: (id: number) => get<AdminOrderResponse>(`/admin/orders/${id}`),
  changeStatus: (id: number, status: OrderStatus) =>
    patch<AdminOrderResponse>(`/admin/orders/${id}/status`, { status }),
};
