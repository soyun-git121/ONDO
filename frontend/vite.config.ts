import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// dev 서버: /api·/uploads 요청을 백엔드(8080)로 프록시
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // 업로드된 이미지는 백엔드가 정적 서빙한다 (ondo.upload.dir)
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
      // 업로드된 이미지는 백엔드가 정적 서빙한다 (ondo.upload.dir)
      "/uploads": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
