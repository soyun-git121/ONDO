/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 백엔드 API 주소. 프론트·백엔드를 다른 도메인에 배포할 때만 설정(예: https://ondo-api.onrender.com). */
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
