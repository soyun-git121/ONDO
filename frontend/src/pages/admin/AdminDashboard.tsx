import { Link } from "react-router-dom";
import {
  adminArtisans,
  adminInquiries,
  adminNews,
  adminOrders,
  adminProducts,
  adminProjects,
} from "../../api/admin";
import { useAdminData } from "../../hooks/useAdminData";
import { PageHeader } from "../../components/admin/Ui";

/** 건수만 필요하므로 size=1로 최소 조회한다 (totalElements만 읽는다). */
function useCount(fetcher: () => Promise<{ totalElements: number }>) {
  const { data, loading, error } = useAdminData(fetcher, []);
  return { count: data?.totalElements ?? null, loading, error };
}

function StatCard({
  to,
  label,
  count,
  loading,
  note,
}: {
  to: string;
  label: string;
  count: number | null;
  loading: boolean;
  note?: string;
}) {
  return (
    <Link
      to={to}
      className="rounded-md border border-border-base bg-surface p-4 transition-shadow hover:shadow-1"
    >
      <p className="text-xs text-text-muted">{label}</p>
      <p className="mt-1 text-xl font-semibold">
        {loading ? "—" : (count ?? 0).toLocaleString()}
      </p>
      {note && <p className="mt-1 text-xs text-text-muted">{note}</p>}
    </Link>
  );
}

export default function AdminDashboard() {
  const artisans = useCount(() => adminArtisans.list({ page: 0, size: 1 }));
  const products = useCount(() => adminProducts.list({ page: 0, size: 1 }));
  const news = useCount(() => adminNews.list({ page: 0, size: 1 }));
  const projects = useCount(() => adminProjects.list({ page: 0, size: 1 }));
  const newInquiries = useCount(() =>
    adminInquiries.list({ page: 0, size: 1, status: "NEW" }),
  );
  const pendingOrders = useCount(() =>
    adminOrders.list({ page: 0, size: 1, status: "PENDING" }),
  );

  return (
    <>
      <PageHeader title="대시보드" description="처리가 필요한 항목부터 확인하세요." />

      <section className="mb-5">
        <h2 className="mb-2 text-sm font-semibold">처리 대기</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <StatCard
            to="/admin/inquiries"
            label="신규 문의"
            count={newInquiries.count}
            loading={newInquiries.loading}
            note="아직 확인하지 않은 협업 문의"
          />
          <StatCard
            to="/admin/orders"
            label="입금 대기 주문"
            count={pendingOrders.count}
            loading={pendingOrders.loading}
            note="입금 확인 후 '결제 완료'로 전환"
          />
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold">콘텐츠</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            to="/admin/artisans"
            label="보유자"
            count={artisans.count}
            loading={artisans.loading}
          />
          <StatCard
            to="/admin/products"
            label="상품"
            count={products.count}
            loading={products.loading}
          />
          <StatCard to="/admin/news" label="뉴스" count={news.count} loading={news.loading} />
          <StatCard
            to="/admin/projects"
            label="협업 실적"
            count={projects.count}
            loading={projects.loading}
          />
        </div>
      </section>
    </>
  );
}
