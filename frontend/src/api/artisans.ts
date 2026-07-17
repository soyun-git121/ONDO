import { get } from "./client";
import type { PageResponse } from "../types/common";
import type { ArtisanSummary, Designation } from "../types/artisan";

export function getArtisans(params: {
  page?: number;
  size?: number;
  designation?: Designation;
}): Promise<PageResponse<ArtisanSummary>> {
  return get<PageResponse<ArtisanSummary>>("/artisans", params);
}
