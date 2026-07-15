import { Link } from "react-router-dom";
import { getHome } from "../api/home";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import SectionHeading from "../components/ui/SectionHeading";
import EmptyBlock from "../components/ui/EmptyBlock";
import Logo from "../components/ui/Logo";
import traditionMark1 from "../assets/tradition_mark_1.svg";
import traditionMark2 from "../assets/tradition_mark_2.svg";
import ArtisanCard from "../components/cards/ArtisanCard";
import ProductCard from "../components/cards/ProductCard";
import ProjectCard from "../components/cards/ProjectCard";
import { NEWS_CATEGORY_LABEL } from "../types/news";

/**
 * 홈 — architecture.md §5: 히어로 → ONDO 소개 요약 → 소속 보유자 → 대표 상품 → 실적/뉴스 → 협업 배너.
 * blit.studio 무드(대형 타이포+여백)를 라이트 팔레트로. 자료 없는 섹션은 빈칸 유지.
 */
export default function Home() {
  const { data, loading } = useFetch(getHome);

  return (
    <main>
      {/* ── Hero — blit.studio 비대칭 에디토리얼 캔버스 (design.md §2) ── */}
      <section className="relative isolate overflow-hidden pb-8 pt-6 lg:pb-9">
        {/* 전통 마크 데코 — 원형 그리드(tradition_mark). 콘텐츠 뒤 장식층, 스크린리더 무시 */}
        <img
          src={traditionMark2}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -z-10 left-[34%] top-0 w-[190px] opacity-90 md:w-[240px] lg:w-[300px]"
        />
        <img
          src={traditionMark1}
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute -z-10 bottom-4 right-[3%] hidden w-[150px] opacity-90 lg:block lg:w-[190px]"
        />
        <Container>
          {/* 대형 로고 — blit의 "blit." 자리·크기 (logo.svg, H≈205px) */}
          <Logo className="h-24 w-auto md:h-36 lg:h-[205px]" />

          {/* 데스크톱: 흩어진 배치 */}
          <div className="mt-7 hidden grid-cols-12 gap-4 lg:grid">
            <p className="col-span-2 col-start-3 text-md">
              전통의 온도를
              <br />
              잇습니다
            </p>
            <p className="col-span-2 col-start-7 text-md">
              소비되는 전통을
              <br />
              만듭니다
            </p>
            {/* 빈 미디어 슬롯 3개 — 이미지 확보 전 네모 빈칸 (design.md §2) */}
            <div className="col-span-3 col-start-10 row-span-2">
              <EmptyBlock label="" className="aspect-[8/9] w-full" />
            </div>
            <div className="col-span-3 col-start-2 row-start-2 mt-7">
              <EmptyBlock label="" className="aspect-[3/5] w-full" />
            </div>
            <div
              aria-hidden="true"
              className="col-span-2 col-start-7 row-start-2 mt-9 aspect-square bg-text-primary"
            />
            <h1 className="col-span-7 col-start-6 row-start-3 mt-8 font-display text-display font-bold leading-[1.05] tracking-[-0.02em]">
              보유자는 창작에
              <br />
              집중하고, 온도는
              <br />
              시장과 연결합니다
            </h1>
          </div>

          {/* 모바일: 세로 스택 */}
          <div className="mt-6 flex flex-col gap-6 lg:hidden">
            <p className="text-md">전통의 온도를 잇습니다</p>
            <EmptyBlock label="" className="aspect-[4/5] w-full" />
            <h1 className="font-display text-display font-bold leading-[1.1] tracking-[-0.02em]">
              보유자는 창작에 집중하고,
              <br />
              온도는 시장과 연결합니다
            </h1>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/artisans"
              className="inline-flex min-h-[44px] items-center rounded-pill bg-primary px-6 py-3 text-base font-medium text-text-primary transition-all duration-fast hover:brightness-[0.94]"
            >
              보유자 만나보기
            </Link>
            <Link
              to="/collaboration"
              className="inline-flex min-h-[44px] items-center rounded-pill border border-border-base px-6 py-3 text-base font-medium transition-colors duration-fast hover:border-text-primary"
            >
              협업 문의하기
            </Link>
          </div>
        </Container>
      </section>

      {/* ── 소속 보유자 ── */}
      <section className="pb-8 lg:pb-9">
        <Container>
          <SectionHeading title="소속 보유자" to="/artisans" linkLabel="전체 보기" />
          {data?.featuredArtisans?.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.featuredArtisans.map((a) => (
                <ArtisanCard key={a.slug} artisan={a} />
              ))}
            </div>
          ) : (
            <EmptyBlock
              label={loading ? "불러오는 중…" : "보유자 소개 준비 중"}
              className="h-48"
            />
          )}
        </Container>
      </section>

      {/* ── 대표 상품 ── */}
      <section className="pb-8 lg:pb-9">
        <Container>
          <SectionHeading title="대표 상품" to="/shop" linkLabel="Shop 보기" />
          {data?.featuredProducts?.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.featuredProducts.map((p) => (
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
          ) : (
            <EmptyBlock label={loading ? "불러오는 중…" : "상품 준비 중"} className="h-48" />
          )}
        </Container>
      </section>

      {/* ── Project (협업 실적) — blit "● Project" 아이브로우 (design.md §3) ── */}
      <section className="pb-8 lg:pb-9">
        <Container>
          <div className="mb-6 flex items-end justify-between gap-4">
            <h2 className="flex items-center gap-2 text-base font-medium">
              <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
              Project
            </h2>
            <Link to="/projects" className="shrink-0 text-sm underline-offset-4 hover:underline">
              전체 보기
            </Link>
          </div>
          {data?.featuredProjects?.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {data.featuredProjects.map((p) => (
                <ProjectCard
                  key={p.slug}
                  slug={p.slug}
                  title={p.title}
                  type={p.type}
                  resultMetric={p.resultMetric}
                  thumbnailUrl={p.thumbnailUrl}
                />
              ))}
            </div>
          ) : (
            <EmptyBlock label={loading ? "불러오는 중…" : "협업 실적 준비 중"} className="h-48" />
          )}
        </Container>
      </section>

      {/* ── 뉴스 ── */}
      <section className="pb-8 lg:pb-9">
        <Container>
          {/* "News +" 헤더 자체가 /news 목록으로 가는 링크 */}
          <div className="mb-6">
            <Link
              to="/news"
              aria-label="News 목록 전체 보기"
              className="inline-flex items-baseline gap-1 font-display text-xl font-bold leading-tight tracking-tight underline-offset-8 transition-colors duration-fast hover:underline lg:text-2xl"
            >
              News <span aria-hidden="true">+</span>
            </Link>
          </div>
          {data?.latestNews?.length ? (
            <ul className="divide-y divide-border-base border-y border-border-base">
              {data.latestNews.map((n) => (
                <li key={n.id}>
                  <Link
                    to={`/news/${n.id}`}
                    className="flex items-baseline justify-between gap-4 py-4 transition-colors duration-fast hover:bg-surface-muted"
                  >
                    <span className="text-base font-medium">{n.title}</span>
                    <span className="shrink-0 text-xs text-text-muted">
                      {NEWS_CATEGORY_LABEL[n.category]} ·{" "}
                      {new Date(n.publishedAt).toLocaleDateString("ko-KR")}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyBlock label={loading ? "불러오는 중…" : "소식 준비 중"} className="h-32" />
          )}
        </Container>
      </section>

      {/* ── 협업 배너 ── */}
      <section className="bg-primary">
        <Container className="flex flex-col items-start gap-6 py-8 lg:py-9">
          <p className="font-display text-2xl font-bold leading-tight tracking-tight text-text-primary">
            전통과 함께할 파트너를 찾습니다
          </p>
          <Link
            to="/collaboration"
            className="inline-flex min-h-[44px] items-center rounded-pill bg-surface px-6 py-3 text-base font-medium text-text-primary transition-shadow duration-fast hover:shadow-2"
          >
            협업 문의하기
          </Link>
        </Container>
      </section>
    </main>
  );
}
