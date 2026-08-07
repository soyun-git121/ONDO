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

import { AdminAuthProvider } from "./auth/AdminAuthContext";
import AdminLayout from "./components/admin/AdminLayout";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ArtisanList from "./pages/admin/ArtisanList";
import ArtisanForm from "./pages/admin/ArtisanForm";
import ProductList from "./pages/admin/ProductList";
import ProductForm from "./pages/admin/ProductForm";
import NewsList from "./pages/admin/NewsList";
import NewsForm from "./pages/admin/NewsForm";
import ProjectList from "./pages/admin/ProjectList";
import ProjectForm from "./pages/admin/ProjectForm";
import InquiryList from "./pages/admin/InquiryList";
import OrderList from "./pages/admin/OrderList";
import OrderDetail from "./pages/admin/OrderDetail";

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

      {/* 관리자 — 공개 Layout(문양 배경·헤더/푸터)을 쓰지 않는 별도 트리. */}
      <Route
        path="/admin"
        element={
          <AdminAuthProvider>
            <AdminLayout />
          </AdminAuthProvider>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="artisans" element={<ArtisanList />} />
        <Route path="artisans/new" element={<ArtisanForm />} />
        <Route path="artisans/:id" element={<ArtisanForm />} />
        <Route path="products" element={<ProductList />} />
        <Route path="products/new" element={<ProductForm />} />
        <Route path="products/:id" element={<ProductForm />} />
        <Route path="news" element={<NewsList />} />
        <Route path="news/new" element={<NewsForm />} />
        <Route path="news/:id" element={<NewsForm />} />
        <Route path="projects" element={<ProjectList />} />
        <Route path="projects/new" element={<ProjectForm />} />
        <Route path="projects/:id" element={<ProjectForm />} />
        <Route path="inquiries" element={<InquiryList />} />
        <Route path="orders" element={<OrderList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
      </Route>

      <Route
        path="/admin/login"
        element={
          <AdminAuthProvider>
            <AdminLogin />
          </AdminAuthProvider>
        }
      />
    </Routes>
  );
}
