import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import TraditionMark from "../ui/TraditionMark";

/** 공통 레이아웃: Header + 페이지 + Footer (architecture.md §5) */
export default function Layout() {
  return (
    <div className="relative flex min-h-screen flex-col bg-bg-base">
      {/* 전통 문양 배경 — design/figma 전 화면 공통 엽전·창살 마크(근사 배치).
          fixed 장식층으로 두어 페이지의 sticky/overflow에 영향 없음. 콘텐츠 뒤(z-0 아래). */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden text-primary opacity-45 lg:block"
      >
        <TraditionMark className="absolute -right-16 top-8 w-[360px]" />
        <TraditionMark className="absolute -left-24 top-[46%] w-[320px]" />
        <TraditionMark className="absolute right-[-40px] top-[70%] w-[300px]" />
      </div>

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
