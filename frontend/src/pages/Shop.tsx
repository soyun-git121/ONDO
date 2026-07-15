import { useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";
import { getArtisans } from "../api/artisans";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import ProductCard from "../components/cards/ProductCard";
import { SkeletonCards } from "../components/ui/Skeleton";
import EmptyBlock from "../components/ui/EmptyBlock";
import Button from "../components/ui/Button";
import type { ProductSort } from "../types/product";

const SORTS: { value: ProductSort; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "priceAsc", label: "낮은 가격순" },
  { value: "priceDesc", label: "높은 가격순" },
];

/**
 * Shop — 피그마 46:2 반영.
 * 좌측 사이드바는 보유자(장인) 필터만 · FEATURED 배너 · 툴바(정렬·결과수) · 3열 그리드.
 */
export default function Shop() {
  const [params, setParams] = useSearchParams();
  const artisan = params.get("artisan") ?? undefined;
  const sort = (params.get("sort") as ProductSort) ?? "latest";
  const page = Number(params.get("page") ?? 0);

  // 사이드바용 보유자 목록
  const artisans = useFetch(() => getArtisans({ size: 50 }), []);
  const { data, loading, error } = useFetch(
    () => getProducts({ page, size: 12, artisan, sort }),
    [page, artisan, sort],
  );

  function setParam(key: string, value: string | null) {
    const next = new URLSearchParams(params);
    if (value === null) next.delete(key);
    else next.set(key, value);
    next.delete("page");
    setParams(next);
  }

  const sidebarItem = (active: boolean) =>
    `flex w-full items-center justify-between py-2 text-left text-sm transition-colors duration-fast ${
      active ? "font-medium text-text-primary" : "text-text-muted hover:text-text-primary"
    }`;

  return (
    <main>
      <Container className="pt-6">
        <p className="text-sm text-text-muted">/shop — 상품 목록</p>
        <h1 className="mt-1 font-display text-2xl font-bold leading-tight tracking-[-0.02em]">Shop</h1>
      </Container>

      <Container className="mt-6 flex flex-col gap-8 pb-8 lg:flex-row lg:pb-9">
        {/* ── 좌측 사이드바: 보유자 필터만 ── */}
        <aside className="shrink-0 lg:w-56">
          <h2 className="text-sm font-bold">보유자</h2>
          <span className="mt-1 block h-0.5 w-6 bg-text-primary" aria-hidden="true" />
          <p className="mt-2 text-xs text-text-muted">장인별 필터</p>

          <nav aria-label="보유자 필터" className="mt-4 flex flex-col divide-y divide-border-base">
            <button type="button" onClick={() => setParam("artisan", null)} className={sidebarItem(!artisan)}>
              전체
            </button>
            {artisans.data?.content.map((a) => (
              <button
                key={a.slug}
                type="button"
                onClick={() => setParam("artisan", a.slug)}
                className={sidebarItem(artisan === a.slug)}
              >
                <span>
                  {a.name} · {a.title}
                </span>
              </button>
            ))}
            {artisans.data && artisans.data.content.length === 0 && (
              <span className="py-2 text-sm text-text-muted">보유자 준비 중</span>
            )}
          </nav>
        </aside>

        {/* ── 우측 메인 ── */}
        <div className="flex-1">
          {/* FEATURED 배너 */}
          <div className="flex flex-col items-center justify-center gap-3 rounded-md bg-surface-muted px-6 py-9 text-center">
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
              FEATURED
            </p>
            <p className="font-display text-xl font-bold leading-tight tracking-tight lg:text-2xl">
              보유자의 손끝, 온도
            </p>
            <p className="text-sm text-text-muted">
              이 계절 온도가 추천하는 보유자의 작품 — 큐레이션 준비 중
            </p>
          </div>

          {/* 툴바 */}
          <div className="mt-6 flex items-center justify-between border-b border-border-base pb-4">
            <label className="flex items-center gap-2 text-sm">
              정렬
              <select
                value={sort}
                onChange={(e) => setParam("sort", e.target.value)}
                className="min-h-[44px] rounded-sm border border-border-base bg-surface px-3 text-sm"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            {data && (
              <p className="text-sm text-text-muted">
                전체 {data.totalElements}점 중 {data.content.length}개
              </p>
            )}
          </div>

          {/* 그리드 */}
          <div className="mt-6">
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SkeletonCards />
              </div>
            ) : error ? (
              <EmptyBlock label={`상품을 불러오지 못했습니다 (${error})`} className="h-48" />
            ) : data && data.content.length > 0 ? (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.content.map((p) => (
                    <ProductCard
                      key={p.slug}
                      slug={p.slug}
                      name={p.name}
                      price={p.price}
                      status={p.status}
                      thumbnailUrl={p.thumbnailUrl}
                      artisanName={p.artisanName}
                    />
                  ))}
                </div>
                {data.hasNext && (
                  <div className="mt-7 flex justify-center">
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const next = new URLSearchParams(params);
                        next.set("page", String(page + 1));
                        setParams(next);
                      }}
                    >
                      다음 상품 보기
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <EmptyBlock label="상품 준비 중" className="h-48" />
            )}
          </div>
        </div>
      </Container>
    </main>
  );
}
