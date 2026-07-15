/** Project DTO — api.md §6과 1:1 */

export type ProjectType =
  | "B2B_GIFT"
  | "COLLAB"
  | "EXPERIENCE"
  | "LECTURE"
  | "B2G"
  | "EXHIBITION"
  | "FUNDING"
  | "ETC";

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  B2B_GIFT: "기업 선물",
  COLLAB: "콜라보",
  EXPERIENCE: "체험",
  LECTURE: "강연",
  B2G: "공공 협력",
  EXHIBITION: "전시",
  FUNDING: "펀딩",
  ETC: "기타",
};

/** GET /api/projects content 항목 */
export interface ProjectSummary {
  slug: string;
  title: string;
  type: ProjectType;
  clientName: string | null;
  summary: string | null;
  resultMetric: string | null;
  thumbnailUrl: string | null;
  projectDate: string;
  artisans: { slug: string; name: string }[];
}

export interface ProjectImage {
  imageUrl: string;
  caption: string | null;
  sortOrder: number;
}

/** GET /api/projects/{slug} */
export interface ProjectDetail {
  slug: string;
  title: string;
  type: ProjectType;
  clientName: string | null;
  summary: string | null;
  description: string | null;
  resultMetric: string | null;
  projectDate: string;
  thumbnailUrl: string | null;
  images: ProjectImage[];
  artisans: {
    slug: string;
    name: string;
    title: string;
    role: string | null;
    profileImageUrl: string | null;
  }[];
}
