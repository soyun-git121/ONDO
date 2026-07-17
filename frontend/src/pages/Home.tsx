import { Link } from "react-router-dom";
import { getHome } from "../api/home";
import { getProjects } from "../api/projects";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import EmptyBlock from "../components/ui/EmptyBlock";
import Logo from "../components/ui/Logo";
import { PROJECT_TYPE_LABEL } from "../types/project";
import { NEWS_CATEGORY_LABEL } from "../types/news";

/**
 * 홈 — Figma 107:80(blit 에디토리얼) 반영.
 * 히어로(비대칭 캔버스) → 실적·News를 대형 비대칭 미디어 블록으로 나열 → 푸터.
 * 전통 문양은 콘텐츠 뒤 장식층으로 흩어 배치(design.md §2).
 */

/**
 * Figma 107:80 실좌표에서 추출한 블록 슬롯 (컨테이너 1280px = viewport 80~1360 기준).
 * lg(데스크톱)에서 Figma 폭·위치·비율 정합, lg 미만은 풀폭 스택 → 반응형.
 *  - Samsung  media 380×337 @x340 → ml 20.31% / w 29.69% / aspect 380:337
 *  - Hwayo#1  media 500×309 @x900 → ml 64.06% / w 39.06% / aspect 500:309 (우측 살짝 블리드)
 *  - News+    media 500×309 @x80  → ml 0      / w 39.06% / aspect 500:309
 *  - Hwayo#2  media 278×624 @x761 → ml 53.20% / w 21.72% / aspect 278:624
 */
const SLOT = [
  { pos: "lg:ml-[20.31%] lg:w-[29.69%]", aspect: "lg:aspect-[380/337]" },
  { pos: "lg:ml-[64.06%] lg:w-[39.06%]", aspect: "lg:aspect-[500/309]" },
  { pos: "lg:ml-0 lg:w-[39.06%]", aspect: "lg:aspect-[500/309]" },
  { pos: "lg:ml-[53.20%] lg:w-[21.72%]", aspect: "lg:aspect-[278/624]" },
];

export default function Home() {
  const { data } = useFetch(getHome);
  const { data: projectPage, loading: projLoading } = useFetch(
    () => getProjects({ featured: true, size: 3 }),
    [],
  );
  const projects = projectPage?.content ?? [];
  const news = data?.latestNews ?? [];

  // Figma 107:80: 실적·News를 하나의 대형 알터네이팅 에디토리얼 블록 흐름으로.
  const blocks = [
    ...projects.map((p) => ({
      key: `p-${p.slug}`,
      to: `/projects/${p.slug}`,
      eyebrow: p.clientName ?? PROJECT_TYPE_LABEL[p.type],
      title: p.title,
      meta: [PROJECT_TYPE_LABEL[p.type], p.resultMetric].filter(Boolean).join(" · "),
      img: p.thumbnailUrl,
      divider: false,
    })),
    ...news.map((n, idx) => ({
      key: `n-${n.id}`,
      to: `/news/${n.id}`,
      eyebrow: "News+",
      title: n.title,
      meta: `${NEWS_CATEGORY_LABEL[n.category]} · ${new Date(n.publishedAt).toLocaleDateString("ko-KR")}`,
      img: n.thumbnailUrl,
      divider: idx === 0, // 실적 → News 사이 구분선 (Figma)
    })),
  ];

  return (
    <main>
      {/* ── Hero — blit.studio 비대칭 에디토리얼 캔버스 (design.md §2) ── */}
      <section className="relative isolate overflow-hidden pb-8 pt-6 lg:pb-9">
        {/* 전통 문양 배경 데코는 공통 Layout 장식층에서 처리 (design/figma 전 화면 공통) */}
        <Container>
          {/* 대형 로고 — blit의 "blit." 자리·크기 */}
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
              <img
                src="/uploads/sample/home-sample2.jpg"
                alt="온도 전통문화 소개"
                className="aspect-[8/9] w-full rounded-md object-cover"
              />
            </div>
            <div className="col-span-3 col-start-2 row-start-2 mt-7">
              <img
                src="/uploads/sample/home-yoonjonnuk-sample.png"
                alt="윤종국 악기장 작업 모습"
                className="aspect-[3/5] w-full rounded-md object-cover"
              />
            </div>
            <div
              aria-hidden="true"
              className="col-span-2 col-start-7 row-start-2 mt-9 aspect-square bg-text-primary"
            />
            <h1 className="col-span-7 col-start-6 row-start-3 mt-8 font-display text-2xl font-bold leading-[1.12] tracking-[-0.02em] lg:text-[3rem]">
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
            <img
              src="/uploads/sample/home-yoonjonnuk-sample.png"
              alt="윤종국 악기장 작업 모습"
              className="aspect-[4/5] w-full rounded-md object-cover"
            />
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

      {/* ── 실적 + News — 대형 좌우 교차 에디토리얼 블록 (Figma 107:80) ── */}
      <section className="relative isolate overflow-hidden py-8 lg:py-9">
        <Container className="relative flex flex-col gap-12 lg:gap-16">
          {blocks.length > 0 ? (
            blocks.map((b, i) => {
              const slot = SLOT[i % SLOT.length];
              return (
                <div key={b.key} className="w-full">
                  {b.divider && <hr className="mb-12 border-border-base lg:mb-16" />}
                  <Link to={b.to} className={`group block w-full ${slot.pos}`}>
                    {/* ● 라벨 아이브로우 (blit) — 프로젝트는 클라이언트명, 뉴스는 News+ */}
                    <p className="mb-4 flex items-center gap-2 text-base font-medium">
                      <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
                      {b.eyebrow}
                    </p>
                    {b.img ? (
                      <img
                        src={b.img}
                        alt={b.title}
                        className={`w-full rounded-md object-cover aspect-[4/3] transition-transform duration-fast group-hover:scale-[1.01] ${slot.aspect}`}
                      />
                    ) : (
                      <EmptyBlock label="" className={`w-full aspect-[4/3] ${slot.aspect}`} />
                    )}
                    <h2 className="mt-5 font-display text-xl font-bold leading-tight tracking-[-0.02em] underline-offset-8 group-hover:underline lg:text-2xl">
                      {b.title}
                    </h2>
                    <p className="mt-2 text-md text-text-muted">{b.meta}</p>
                  </Link>
                </div>
              );
            })
          ) : (
            <EmptyBlock
              label={projLoading ? "불러오는 중…" : "콘텐츠 준비 중"}
              className="h-64"
            />
          )}
        </Container>
      </section>

    </main>
  );
}
