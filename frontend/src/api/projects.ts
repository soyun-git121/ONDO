import { get } from "./client";
import type { PageResponse } from "../types/common";
import type { ProjectDetail, ProjectSummary, ProjectType } from "../types/project";

export function getProjects(params: {
  page?: number;
  size?: number;
  type?: ProjectType;
  artisan?: string;
  featured?: boolean;
}): Promise<PageResponse<ProjectSummary>> {
  return get<PageResponse<ProjectSummary>>("/projects", params);
}

export function getProject(slug: string): Promise<ProjectDetail> {
  return get<ProjectDetail>(`/projects/${slug}`);
}
