import { useSearchParams } from "react-router-dom";
import { getProjects } from "../api/projects";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import ProjectCard from "../components/cards/ProjectCard";
import EmptyBlock from "../components/ui/EmptyBlock";
import Button from "../components/ui/Button";
import { SkeletonCards } from "../components/ui/Skeleton";
import { PROJECT_TYPE_LABEL, type ProjectType } from "../types/project";

const TYPES = Object.keys(PROJECT_TYPE_LABEL) as ProjectType[];

/** 협업 실적 목록 — 유형 필터 + projectDate DESC 타임라인 (architecture.md §5) */
export default function Projects() {
  const [params, setParams] = useSearchParams();
  const type = (params.get("type") as ProjectType) ?? undefined;
  const page = Number(params.get("page") ?? 0);

  const { data, loading, error } = useFetch(
    () => getProjects({ page, size: 12, type }),
    [page, type],
  );

  function selectType(next: ProjectType | null) {
    const p = new URLSearchParams();
    if (next) p.set("type", next);
    setParams(p);
  }

  return (
    <main>
      <section className="py-8 lg:py-9">
        <Container>
          <h1 className="font-display text-2xl font-bold leading-tight tracking-[-0.02em]">
            Projects
          </h1>
          <p className="mt-4 max-w-xl text-md text-text-muted">
            온도가 보유자와 함께 만든 협업의 기록입니다.
          </p>
        </Container>
      </section>

      <section className="pb-8 lg:pb-9">
        <Container>
          <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="실적 유형 필터">
            <button
              type="button"
              onClick={() => selectType(null)}
              aria-pressed={!type}
              className={`min-h-[44px] rounded-pill border px-4 text-sm transition-colors duration-fast ${
                !type ? "border-text-primary bg-text-primary text-surface" : "border-border-base hover:border-text-primary"
              }`}
            >
              전체
            </button>
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => selectType(t)}
                aria-pressed={type === t}
                className={`min-h-[44px] rounded-pill border px-4 text-sm transition-colors duration-fast ${
                  type === t ? "border-text-primary bg-text-primary text-surface" : "border-border-base hover:border-text-primary"
                }`}
              >
                {PROJECT_TYPE_LABEL[t]}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <SkeletonCards />
            </div>
          ) : error ? (
            <EmptyBlock label={`실적을 불러오지 못했습니다 (${error})`} className="h-48" />
          ) : data && data.content.length > 0 ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {data.content.map((p) => (
                  <ProjectCard
                    key={p.slug}
                    slug={p.slug}
                    title={p.title}
                    type={p.type}
                    resultMetric={p.resultMetric}
                    thumbnailUrl={p.thumbnailUrl}
                    clientName={p.clientName}
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
                    다음 실적 보기
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyBlock label="협업 실적 준비 중" className="h-48" />
          )}
        </Container>
      </section>
    </main>
  );
}
