import axios from "axios";

/**
 * 공통 axios 클라이언트. API 호출은 src/api/ 안에서만 작성한다 (claude.md 컨벤션).
 * 응답은 항상 ApiResponse<T> 래핑 — 인터셉터에서 success 검사 후 data만 반환.
 */
export const client = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const body = error.response?.data?.error;
    return Promise.reject(
      new ApiError(body?.code ?? "NETWORK_ERROR", body?.message ?? "요청에 실패했습니다."),
    );
  },
);

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
  }
}

/** ApiResponse 언래핑 헬퍼 */
export async function get<T>(url: string, params?: object): Promise<T> {
  const res = await client.get(url, { params });
  return res.data.data as T;
}

export async function post<T>(url: string, body?: object): Promise<T> {
  const res = await client.post(url, body);
  return res.data.data as T;
}
