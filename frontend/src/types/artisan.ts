/** Artisan DTO — api.md §2와 1:1 */

import type { ProductCategory, ProductStatus } from "./product";
import type { ProjectType } from "./project";

export type Designation = "HOLDER" | "SUCCESSOR" | "MASTER";

/**
 * 지정 구분 표기 — 2024년 「국가유산기본법」 시행으로 '국가무형문화재'가
 * '국가무형유산'으로 개칭됨. 화면 표기는 반드시 이 맵을 거칠 것.
 */
export const DESIGNATION_LABEL: Record<Designation, string> = {
  HOLDER: "국가무형유산 보유자",
  SUCCESSOR: "이수자",
  MASTER: "명장",
};

/** GET /api/artisans content 항목 */
export interface ArtisanSummary {
  slug: string;
  name: string;
  title: string;
  designation: Designation;
  shortIntro: string;
  profileImageUrl: string | null;
}

/** GET /api/artisans/{slug} — 상세 + 갤러리 + 대표 상품 + 참여 실적 */
export interface ArtisanDetail {
  slug: string;
  name: string;
  title: string;
  designation: Designation;
  shortIntro: string;
  story: string | null;
  coverImageUrl: string | null;
  profileImageUrl: string | null;
  videoUrl: string | null;
  /** 임의 키(instagram, youtube 등) — admin에서 자유롭게 넣는다. */
  snsLinks: Record<string, string>;
  images: { imageUrl: string; caption: string | null; sortOrder: number }[];
  products: {
    slug: string;
    name: string;
    price: number;
    category: ProductCategory;
    status: ProductStatus;
    thumbnailUrl: string | null;
  }[];
  projects: {
    slug: string;
    title: string;
    type: ProjectType;
    resultMetric: string | null;
    projectDate: string;
    thumbnailUrl: string | null;
  }[];
}
