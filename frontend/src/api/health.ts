import { get } from "./client";

export interface HealthResponse {
  status: string;
  service: string;
  time: string;
}

export function getHealth(): Promise<HealthResponse> {
  return get<HealthResponse>("/health");
}
