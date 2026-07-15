import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

/** 공통 레이아웃: Header + 페이지 + Footer (architecture.md §5) */
export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg-base">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
