import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// dev 서버: /api 요청을 백엔드(8080)로 프록시
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
      },
    },
  },
});
