import { Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Artisans from "./pages/Artisans";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import OrderPage from "./pages/OrderPage";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Collaboration from "./pages/Collaboration";
import NotFound from "./pages/NotFound";

/** 라우트 구조는 architecture.md §5 참조. */
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/artisans" element={<Artisans />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/shop/:slug" element={<ProductDetail />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/collaboration" element={<Collaboration />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
