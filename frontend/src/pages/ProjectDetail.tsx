import { Link, useParams } from "react-router-dom";
import { getProject } from "../api/projects";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import EmptyBlock from "../components/ui/EmptyBlock";
import Skeleton from "../components/ui/Skeleton";
import Markdown from "../components/ui/Markdown";
import { PROJECT_TYPE_LABEL } from "../types/project";

/**
 * 실적 상세 — architecture.md §5: 배경 → 진행 → 결과(성과 지표 강조) → 참여 보유자 → 협업문의 CTA.
 */
export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useFetch(() => getProject(slug!), [slug]);

  if (loading) {
    return (
      <main>
        <Container className="max-w-2xl py-8">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="mt-4 h-4 w-40" />
          <Skeleton className="mt-8 h-64 w-full" />
        </Container>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main>
        <Container className="py-9 text-center">
          <h1 className="font-display text-xl font-bold">실적 정보를 불러오지 못했습니다</h1>
          <p className="mt-3 text-sm text-text-muted">{error}</p>
          <Link to="/projects" className="mt-6 inline-block underline underline-offset-4">
            Projects로 돌아가기
          </Link>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <article>
        <section className="py-8 lg:py-9">
          <Container className="max-w-2xl">
            <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs">
              {PROJECT_TYPE_LABEL[data.type]}
            </span>
            <h1 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.02em]">
              {data.title}
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              {data.clientName && `${data.clientName} · `}
              {new Date(data.projectDate).toLocaleDateString("ko-KR")}
            </p>
            {data.resultMetric && (
              <p className="mt-5 w-fit bg-secondary px-3 py-1 text-lg font-bold">
                {data.resultMetric}
              </p>
            )}
          </Container>
        </section>

        <section className="pb-8 lg:pb-9">
          <Container className="max-w-2xl">
            {data.thumbnailUrl ? (
              <img src={data.thumbnailUrl} alt={data.title} className="w-full rounded-md object-cover" />
            ) : (
              <EmptyBlock label="대표 이미지 준비 중" className="h-64" />
            )}
            <div className="mt-7">
              {data.description ? (
                <Markdown text={data.description} />
              ) : (
                <EmptyBlock label="프로젝트 상세 원고 준비 중 (배경 → 진행 → 결과)" className="h-40" />
              )}
            </div>
          </Container>
        </section>

        {/* 갤러리 */}
        {data.images.length > 0 && (
          <section className="pb-8 lg:pb-9">
            <Container className="max-w-2xl">
              <div className="grid grid-cols-2 gap-4">
                {data.images.map((img) => (
                  <figure key={img.sortOrder} className="overflow-hidden rounded-md bg-surface-muted">
                    <img
                      src={img.imageUrl}
                      alt={img.caption ?? data.title}
                      loading="lazy"
                      className="aspect-square w-full object-cover"
                    />
                    {img.caption && (
                      <figcaption className="p-3 text-xs text-text-muted">{img.caption}</figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* 참여 보유자 */}
        <section className="pb-8 lg:pb-9">
          <Container className="max-w-2xl">
            <h2 className="mb-5 font-display text-xl font-bold leading-tight">참여 보유자</h2>
            {data.artisans.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {data.artisans.map((a) => (
                  <li key={a.slug}>
                    <Link
                      to={`/artisans/${a.slug}`}
                      className="flex items-center gap-3 rounded-md border border-border-base p-4 transition-colors duration-fast hover:border-text-primary"
                    >
                      {a.profileImageUrl ? (
                        <img
                          src={a.profileImageUrl}
                          alt={`${a.name} ${a.title}`}
                          className="h-12 w-12 rounded-pill object-cover"
                        />
                      ) : (
                        <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-surface-muted text-xs text-text-muted">
                          {a.name.slice(0, 1)}
                        </span>
                      )}
                      <span className="flex flex-col">
                        <span className="font-bold">
                          {a.name} <span className="font-medium text-text-muted">{a.title}</span>
                        </span>
                        {a.role && <span className="text-sm text-text-muted">{a.role}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <EmptyBlock label="참여 보유자 정보 준비 중" className="h-24" />
            )}
          </Container>
        </section>
      </article>

      <section className="bg-primary">
        <Container className="flex flex-col items-start gap-6 py-8">
          <p className="font-display text-xl font-bold leading-tight lg:text-2xl">
            이런 프로젝트를 함께 만들고 싶다면
          </p>
          <Link
            to="/collaboration"
            className="inline-flex min-h-[44px] items-center rounded-pill bg-surface px-6 py-3 text-base font-medium transition-shadow duration-fast hover:shadow-2"
          >
            협업 문의하기
          </Link>
        </Container>
      </section>
    </main>
  );
}
