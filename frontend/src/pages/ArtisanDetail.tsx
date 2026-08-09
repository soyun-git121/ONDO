import { Link, useParams } from "react-router-dom";
import { getArtisan } from "../api/artisans";
import { useFetch } from "../hooks/useFetch";
import { DESIGNATION_LABEL } from "../types/artisan";
import { PRODUCT_CATEGORY_LABEL, priceText } from "../types/product";
import { PROJECT_TYPE_LABEL } from "../types/project";
import { resolveImageUrl } from "../api/client";
import Container from "../components/layout/Container";
import Markdown from "../components/ui/Markdown";
import Skeleton from "../components/ui/Skeleton";

/**
 * 보유자 랜딩 — GET /api/artisans/{slug}. api.md §2.
 *
 * Figma에 전용 프레임이 없어 Shop·Product Detail과 같은 디자인 언어로 구성했다.
 * 구성: 커버 + 프로필(이름·지정구분·한줄소개·SNS) + 이야기(마크다운) + 공방 갤러리
 *      + 이 보유자의 상품 + 참여한 협업 실적.
 *
 * 그동안 보유자 목록 카드가 /artisans/{slug}로 링크하는데 라우트가 없어 404였다.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

/** snsLinks는 admin에서 임의 키로 넣는다 — 알려진 키만 보기 좋게 이름을 바꾼다. */
const SNS_LABEL: Record<string, string> = {
  instagram: "Instagram",
  youtube: "YouTube",
  facebook: "Facebook",
  blog: "Blog",
  homepage: "Homepage",
};

export default function ArtisanDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useFetch(() => getArtisan(slug!), [slug]);

  if (loading) {
    return (
      <main>
        <Container className="py-8">
          <Skeleton className="aspect-[1280/360] w-full" />
          <Skeleton className="mt-6 h-10 w-64" />
          <Skeleton className="mt-4 h-4 w-96" />
        </Container>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main>
        <Container className="py-9 text-center">
          <h1 className="text-[22px] font-bold text-text-primary">보유자 정보를 불러오지 못했습니다</h1>
          <p className="mt-3 text-[14px] text-text-muted">{error}</p>
          <Link to="/artisans" className="mt-6 inline-block text-[14px] underline underline-offset-4">
            Master로 돌아가기
          </Link>
        </Container>
      </main>
    );
  }

  const sns = Object.entries(data.snsLinks ?? {}).filter(([, url]) => !!url);

  return (
    <main style={{ fontFamily: INTER }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-6 sm:px-6 lg:px-5">
        <p className="whitespace-pre-wrap text-[14px] text-text-muted">
          <Link to="/artisans" className="underline-offset-4 hover:underline">
            Master
          </Link>
          {`  ›  ${data.name}`}
        </p>

        {/* 커버 — 없으면 회색 자리 유지 */}
        {data.coverImageUrl ? (
          <img
            src={resolveImageUrl(data.coverImageUrl)}
            alt=""
            className="mt-6 aspect-[1280/360] w-full rounded-[4px] bg-surface-muted object-cover"
          />
        ) : (
          <div className="mt-6 aspect-[1280/360] w-full rounded-[4px] bg-surface-muted" />
        )}

        {/* 프로필 */}
        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
          {data.profileImageUrl ? (
            <img
              src={resolveImageUrl(data.profileImageUrl)}
              alt=""
              className="h-[120px] w-[120px] shrink-0 rounded-full bg-surface-muted object-cover"
            />
          ) : (
            <div className="h-[120px] w-[120px] shrink-0 rounded-full bg-surface-muted" />
          )}

          <div className="min-w-0">
            <p className="text-[14px] font-medium text-text-muted">
              {DESIGNATION_LABEL[data.designation]}
            </p>
            <h1 className="mt-2 text-[clamp(30px,8vw,42px)] font-bold text-text-primary">
              {data.name} <span className="text-[0.6em] font-medium">{data.title}</span>
            </h1>
            <p className="mt-3 text-[17px] leading-[1.6] text-text-muted">{data.shortIntro}</p>

            {sns.length > 0 && (
              <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                {sns.map(([key, url]) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[14px] text-text-primary underline-offset-4 hover:underline"
                  >
                    {SNS_LABEL[key] ?? key} ↗
                  </a>
                ))}
              </p>
            )}
          </div>
        </div>

        {/* 이야기 */}
        {data.story?.trim() && (
          <div className="mt-12 border-t border-border-base pt-10">
            <p className="flex items-center gap-2 text-[14px] font-medium text-text-muted">
              <span aria-hidden="true" className="h-[10px] w-[10px] rounded-full bg-accent" />
              STORY
            </p>
            <h2 className="mt-3 text-[clamp(26px,7vw,34px)] font-bold text-text-primary">
              {data.name}의 이야기
            </h2>
            <div className="mt-6 max-w-[760px] text-text-primary">
              <Markdown text={data.story} />
            </div>
          </div>
        )}

        {/* 영상 — admin에 링크만 저장되므로 새 탭으로 연다(임베드는 도메인별 처리가 필요). */}
        {data.videoUrl && (
          <p className="mt-8">
            <a
              href={data.videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[14px] text-text-primary underline underline-offset-4"
            >
              작업 영상 보기 ↗
            </a>
          </p>
        )}

        {/* 공방 갤러리 */}
        {data.images.length > 0 && (
          <div className="mt-12">
            <h2 className="text-[clamp(22px,6vw,30px)] font-bold text-text-primary">공방</h2>
            <div className="mt-6 grid grid-cols-1 gap-x-[40px] gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.images.map((img) => (
                <figure key={img.imageUrl}>
                  <img
                    src={resolveImageUrl(img.imageUrl)}
                    alt={img.caption ?? ""}
                    loading="lazy"
                    className="aspect-[4/3] w-full rounded-[4px] bg-surface-muted object-cover"
                  />
                  {img.caption && (
                    <figcaption className="mt-2 text-[13px] text-[#999]">{img.caption}</figcaption>
                  )}
                </figure>
              ))}
            </div>
          </div>
        )}

        {/* 이 보유자의 상품 */}
        {data.products.length > 0 && (
          <div className="mt-12">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[clamp(22px,6vw,30px)] font-bold text-text-primary">
                {data.name}의 상품
              </h2>
              <Link
                to="/shop"
                className="whitespace-nowrap text-[14px] text-text-primary underline-offset-4 hover:underline"
              >
                전체 보기
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-x-[40px] gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.products.map((p) => (
                <Link key={p.slug} to={`/shop/${p.slug}`} className="group block">
                  {p.thumbnailUrl ? (
                    <img
                      src={resolveImageUrl(p.thumbnailUrl)}
                      alt=""
                      loading="lazy"
                      className="aspect-[420/360] w-full bg-surface-muted object-cover"
                    />
                  ) : (
                    <div className="aspect-[420/360] w-full bg-surface-muted" />
                  )}
                  <p className="mt-4 text-[12px] text-[#999]">
                    {PRODUCT_CATEGORY_LABEL[p.category]}
                  </p>
                  <p className="mt-1 text-[15px] font-medium text-text-primary group-hover:underline">
                    {p.name}
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-text-primary">{priceText(p)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 참여한 협업 실적 */}
        {data.projects.length > 0 && (
          <div className="mt-12">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[clamp(22px,6vw,30px)] font-bold text-text-primary">참여한 협업</h2>
              <Link
                to="/projects"
                className="whitespace-nowrap text-[14px] text-text-primary underline-offset-4 hover:underline"
              >
                전체 실적 보기
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-x-[40px] gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.projects.map((p) => (
                <Link key={p.slug} to={`/projects/${p.slug}`} className="group block">
                  {p.thumbnailUrl ? (
                    <img
                      src={resolveImageUrl(p.thumbnailUrl)}
                      alt=""
                      loading="lazy"
                      className="aspect-[400/240] w-full rounded-[4px] bg-surface-muted object-cover"
                    />
                  ) : (
                    <div className="aspect-[400/240] w-full rounded-[4px] bg-surface-muted" />
                  )}
                  <span className="mt-4 inline-flex h-[24px] items-center rounded-[12px] border border-border-base bg-[#fefefe] px-[8px] text-[12px] text-text-primary">
                    {PROJECT_TYPE_LABEL[p.type]}
                  </span>
                  <p className="mt-3 text-[18px] font-bold text-text-primary group-hover:underline">
                    {p.title}
                  </p>
                  {p.resultMetric && (
                    <span className="mt-3 inline-flex h-[26px] items-center bg-secondary px-[8px] text-[14px] font-medium text-text-primary">
                      {p.resultMetric}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
