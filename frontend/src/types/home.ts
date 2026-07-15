/** GET /api/home 통합 응답 — api.md §1과 1:1 */

import type { Designation } from "./artisan";
import type { ProductStatus } from "./product";
import type { ProjectType } from "./project";
import type { NewsCategory } from "./news";

export interface HomeData {
  featuredArtisans: {
    slug: string;
    name: string;
    title: string;
    designation: Designation;
    shortIntro: string;
    profileImageUrl: string | null;
  }[];
  featuredProducts: {
    slug: string;
    name: string;
    price: number;
    thumbnailUrl: string | null;
    artisanName: string;
    status: ProductStatus;
  }[];
  featuredProjects: {
    slug: string;
    title: string;
    type: ProjectType;
    resultMetric: string | null;
    thumbnailUrl: string | null;
  }[];
  latestNews: {
    id: number;
    title: string;
    category: NewsCategory;
    thumbnailUrl: string | null;
    publishedAt: string;
  }[];
}
