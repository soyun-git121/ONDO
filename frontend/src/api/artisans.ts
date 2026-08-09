import { get } from "./client";
import type { PageResponse } from "../types/common";
import type { ArtisanDetail, ArtisanSummary, Designation } from "../types/artisan";

export function getArtisans(params: {
  page?: number;
  size?: number;
  designation?: Designation;
}): Promise<PageResponse<ArtisanSummary>> {
  return get<PageResponse<ArtisanSummary>>("/artisans", params);
}

export function getArtisan(slug: string): Promise<ArtisanDetail> {
  return get<ArtisanDetail>(`/artisans/${slug}`);
}
