import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import BackgroundPattern from "../ui/BackgroundPattern";

/** 공통 레이아웃: Header + 페이지 + Footer (architecture.md §5) */
export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg-base">
      {/* 전통 구름 문양 배경 — Figma foundation "BackgroundPattern / cloud"(239:33) 전 화면 공통.
          문서 전체 높이를 덮는 장식층(콘텐츠 뒤 z-0 아래). */}
      <BackgroundPattern className="z-0" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
        <Footer />
      </div>
    </div>
  );
}
