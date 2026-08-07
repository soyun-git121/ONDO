import axios from "axios";

/**
 * 공통 axios 클라이언트. API 호출은 src/api/ 안에서만 작성한다 (claude.md 컨벤션).
 * 응답은 항상 ApiResponse<T> 래핑 — 인터셉터에서 success 검사 후 data만 반환.
 */
export const client = axios.create({
  baseURL: "/api",
  timeout: 10_000,
});

/* ---------- 관리자 인증 토큰 ---------- */

const TOKEN_KEY = "ondo.admin.token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * 401을 받았을 때 실행할 콜백 — AdminAuthProvider가 등록한다.
 * 여기서 직접 라우팅하지 않는 이유: client는 React 밖이라 navigate를 쓸 수 없고,
 * window.location으로 이동하면 SPA가 통째로 새로고침되기 때문.
 */
let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

client.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    const url: string = error.config?.url ?? "";

    // 관리자 API에서 인증이 끊기면 토큰을 버리고 로그인 화면으로 돌린다.
    // 로그인 요청 자체의 401(비밀번호 틀림)은 화면에서 메시지로 처리해야 하므로 제외.
    if (status === 401 && url.startsWith("/admin") && !url.startsWith("/admin/auth/login")) {
      clearToken();
      onUnauthorized?.();
    }

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

/* ---------- ApiResponse 언래핑 헬퍼 ---------- */

export async function get<T>(url: string, params?: object): Promise<T> {
  const res = await client.get(url, { params });
  return res.data.data as T;
}

export async function post<T>(url: string, body?: object): Promise<T> {
  const res = await client.post(url, body);
  return res.data.data as T;
}

export async function put<T>(url: string, body?: object): Promise<T> {
  const res = await client.put(url, body);
  return res.data.data as T;
}

export async function patch<T>(url: string, body?: object): Promise<T> {
  const res = await client.patch(url, body);
  return res.data.data as T;
}

export async function del<T = void>(url: string): Promise<T> {
  const res = await client.delete(url);
  return res.data.data as T;
}

/** multipart 업로드 — 이미지 등. Content-Type은 axios가 boundary와 함께 자동 설정. */
export async function postFile<T>(url: string, file: File): Promise<T> {
  const form = new FormData();
  form.append("file", file);
  const res = await client.post(url, form);
  return res.data.data as T;
}
