import { get } from "./client";
import type { PageResponse } from "../types/common";
import type {
  ProjectDetail,
  ProjectPlacement,
  ProjectSummary,
  ProjectType,
} from "../types/project";

export function getProjects(params: {
  page?: number;
  size?: number;
  type?: ProjectType;
  artisan?: string;
  /** 지정하면 해당 페이지에 노출하도록 admin이 고른 실적만 내려온다. */
  placement?: ProjectPlacement;
}): Promise<PageResponse<ProjectSummary>> {
  return get<PageResponse<ProjectSummary>>("/projects", params);
}

export function getProject(slug: string): Promise<ProjectDetail> {
  return get<ProjectDetail>(`/projects/${encodeURIComponent(slug)}`);
}
