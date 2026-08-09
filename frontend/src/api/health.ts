import { get } from "./client";

export interface HealthResponse {
  status: string;
  service: string;
  /** DB 연결 상태 — "UP" | "DOWN". 백엔드가 떠 있어도 DB는 죽어 있을 수 있다. */
  db: string;
  time: string;
}

export function getHealth(): Promise<HealthResponse> {
  return get<HealthResponse>("/health");
}
