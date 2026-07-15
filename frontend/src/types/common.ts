/** 백엔드 공통 응답 타입 — kr.ondo.global.response와 1:1 (claude.md 컨벤션) */

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string } | null;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}
