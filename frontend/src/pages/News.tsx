import { useSearchParams } from "react-router-dom";
import { getNewsList } from "../api/news";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import NewsCard from "../components/cards/NewsCard";
import EmptyBlock from "../components/ui/EmptyBlock";
import Button from "../components/ui/Button";
import { SkeletonCards } from "../components/ui/Skeleton";
import { NEWS_CATEGORY_LABEL, type NewsCategory } from "../types/news";

const TABS = Object.keys(NEWS_CATEGORY_LABEL) as NewsCategory[];

/** News 목록 — 탭: 온도 소식 / 전통문화 / 보유자 소식 (architecture.md §5) */
export default function News() {
  const [params, setParams] = useSearchParams();
  const category = (params.get("category") as NewsCategory) ?? undefined;
  const page = Number(params.get("page") ?? 0);

  const { data, loading, error } = useFetch(
    () => getNewsList({ page, size: 12, category }),
    [page, category],
  );

  function selectTab(next: NewsCategory | null) {
    const p = new URLSearchParams();
    if (next) p.set("category", next);
    setParams(p);
  }

  return (
    <main>
      <section className="pb-6 pt-8 lg:pt-9">
        <Container>
          <h1 className="font-display text-display font-bold leading-[1.05] tracking-[-0.02em]">News</h1>
          <p className="mt-4 max-w-xl text-md text-text-muted">
            온도와 전통문화의 소식을 전합니다.
          </p>
        </Container>
      </section>

      <section className="pb-8 lg:pb-9">
        <Container>
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="뉴스 분류">
            <button
              type="button"
              onClick={() => selectTab(null)}
              aria-pressed={!category}
              className={`min-h-[44px] rounded-pill border px-4 text-sm transition-colors duration-fast ${
                !category ? "border-text-primary bg-text-primary text-surface" : "border-border-base hover:border-text-primary"
              }`}
            >
              전체
            </button>
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => selectTab(t)}
                aria-pressed={category === t}
                className={`min-h-[44px] rounded-pill border px-4 text-sm transition-colors duration-fast ${
                  category === t ? "border-text-primary bg-text-primary text-surface" : "border-border-base hover:border-text-primary"
                }`}
              >
                {NEWS_CATEGORY_LABEL[t]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SkeletonCards />
            </div>
          ) : error ? (
            <EmptyBlock label={`소식을 불러오지 못했습니다 (${error})`} className="h-48" />
          ) : data && data.content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.content.map((n) => (
                  <NewsCard key={n.id} news={n} />
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
                    다음 소식 보기
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyBlock label="소식 준비 중" className="h-48" />
          )}
        </Container>
      </section>
    </main>
  );
}
