/** Artisan DTO — api.md §2와 1:1 */

export type Designation = "HOLDER" | "SUCCESSOR" | "MASTER";

export const DESIGNATION_LABEL: Record<Designation, string> = {
  HOLDER: "국가무형문화재 보유자",
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

export interface ArtisanImage {
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

/** GET /api/artisans/{slug} */
export interface ArtisanDetail {
  slug: string;
  name: string;
  title: string;
  designation: Designation;
  shortIntro: string;
  story: string;
  coverImageUrl: string | null;
  profileImageUrl: string | null;
  videoUrl: string | null;
  snsLinks: Record<string, string> | null;
  images: ArtisanImage[];
  products: ArtisanProductItem[];
  projects: ArtisanProjectItem[];
}

export interface ArtisanProductItem {
  slug: string;
  name: string;
  price: number;
  category: string;
  status: string;
  thumbnailUrl: string | null;
}

export interface ArtisanProjectItem {
  slug: string;
  title: string;
  type: string;
  resultMetric: string | null;
  projectDate: string;
  thumbnailUrl: string | null;
}
