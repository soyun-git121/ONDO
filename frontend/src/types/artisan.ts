/** Artisan DTO — api.md §2와 1:1 */

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
