import { Link, useParams } from "react-router-dom";
import { getArtisan } from "../api/artisans";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import EmptyBlock from "../components/ui/EmptyBlock";
import Skeleton from "../components/ui/Skeleton";
import Markdown from "../components/ui/Markdown";
import SectionHeading from "../components/ui/SectionHeading";
import ProductCard from "../components/cards/ProductCard";
import ProjectCard from "../components/cards/ProjectCard";
import { DESIGNATION_LABEL } from "../types/artisan";
import type { ProductStatus } from "../types/product";
import type { ProjectType } from "../types/project";

/**
 * 보유자 개별 랜딩 — architecture.md §5:
 * 커버 → 스토리 → 영상 → 갤러리 → 이 보유자의 상품 → 협업 문의 CTA.
 */
export default function ArtisanDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useFetch(() => getArtisan(slug!), [slug]);

  if (loading) {
    return (
      <main>
        <Skeleton className="h-72 w-full rounded-none lg:h-96" />
        <Container className="py-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="mt-4 h-4 w-72" />
        </Container>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main>
        <Container className="py-9 text-center">
          <h1 className="font-display text-xl font-bold">보유자 정보를 불러오지 못했습니다</h1>
          <p className="mt-3 text-sm text-text-muted">{error}</p>
          <Link to="/artisans" className="mt-6 inline-block underline underline-offset-4">
            보유자 목록으로 돌아가기
          </Link>
        </Container>
      </main>
    );
  }

  return (
    <main>
      {/* 커버 (풀블리드) */}
      {data.coverImageUrl ? (
        <img
          src={data.coverImageUrl}
          alt={`${data.name} ${data.title} 작업 모습`}
          className="h-72 w-full object-cover lg:h-96"
        />
      ) : (
        <EmptyBlock label="커버 이미지 준비 중" className="h-72 rounded-none border-x-0 lg:h-96" />
      )}

      {/* 소개 */}
      <section className="py-8 lg:py-9">
        <Container>
          <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs">
            {DESIGNATION_LABEL[data.designation]}
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.02em]">
            {data.name}{" "}
            <span className="text-xl font-medium text-text-muted">{data.title}</span>
          </h1>
          <p className="mt-4 max-w-xl text-md text-text-muted">{data.shortIntro}</p>
        </Container>
      </section>

      {/* 스토리 (마크다운) */}
      <section className="pb-8 lg:pb-9">
        <Container>
          {data.story ? (
            <div className="max-w-2xl">
              <Markdown text={data.story} />
            </div>
          ) : (
            <EmptyBlock label="스토리 원고 준비 중" className="h-40" />
          )}
        </Container>
      </section>

      {/* 영상 */}
      <section className="pb-8 lg:pb-9">
        <Container>
          {data.videoUrl ? (
            <div className="aspect-video w-full overflow-hidden rounded-md bg-surface-muted">
              <iframe
                src={data.videoUrl}
                title={`${data.name} ${data.title} 스토리 영상`}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <EmptyBlock label="스토리 영상 준비 중" className="aspect-video w-full" />
          )}
        </Container>
      </section>

      {/* 갤러리 */}
      <section className="pb-8 lg:pb-9">
        <Container>
          <SectionHeading title="공방과 작업" />
          {data.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              {data.images.map((img) => (
                <figure key={img.sortOrder} className="overflow-hidden rounded-md bg-surface-muted">
                  <img
                    src={img.imageUrl}
                    alt={img.caption ?? `${data.name} ${data.title} 작업 모습`}
                    loading="lazy"
                    className="aspect-square w-full object-cover"
                  />
                  {img.caption && (
                    <figcaption className="p-3 text-xs text-text-muted">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          ) : (
            <EmptyBlock label="갤러리 이미지 준비 중" className="h-48" />
          )}
        </Container>
      </section>

      {/* 이 보유자의 상품 */}
      <section className="pb-8 lg:pb-9">
        <Container>
          <SectionHeading title={`${data.name}의 상품`} to={`/shop?artisan=${data.slug}`} linkLabel="전체 보기" />
          {data.products.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.products.map((p) => (
                <ProductCard
                  key={p.slug}
                  slug={p.slug}
                  name={p.name}
                  price={p.price}
                  status={p.status as ProductStatus}
                  thumbnailUrl={p.thumbnailUrl}
                  artisanName={data.name}
                />
              ))}
            </div>
          ) : (
            <EmptyBlock label="상품 준비 중" className="h-40" />
          )}
        </Container>
      </section>

      {/* 참여 프로젝트 */}
      <section className="pb-8 lg:pb-9">
        <Container>
          <SectionHeading title="참여 프로젝트" />
          {data.projects.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.projects.map((p) => (
                <ProjectCard
                  key={p.slug}
                  slug={p.slug}
                  title={p.title}
                  type={p.type as ProjectType}
                  resultMetric={p.resultMetric}
                  thumbnailUrl={p.thumbnailUrl}
                />
              ))}
            </div>
          ) : (
            <EmptyBlock label="참여 프로젝트 준비 중" className="h-40" />
          )}
        </Container>
      </section>

      {/* 협업 문의 CTA */}
      <section className="bg-primary">
        <Container className="flex flex-col items-start gap-6 py-8">
          <p className="font-display text-xl font-bold leading-tight lg:text-2xl">
            {data.name} {data.title}와(과)의 협업을 원하시나요?
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
