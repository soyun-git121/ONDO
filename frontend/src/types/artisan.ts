/** Artisan DTO — api.md §2와 1:1 */

export type Designation = "HOLDER" | "SUCCESSOR" | "MASTER";

/** GET /api/artisans content 항목 */
export interface ArtisanSummary {
  slug: string;
  name: string;
  title: string;
  designation: Designation;
  shortIntro: string;
  profileImageUrl: string | null;
}
