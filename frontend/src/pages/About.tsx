import Container from "../components/layout/Container";
import EmptyBlock from "../components/ui/EmptyBlock";

/**
 * About — 피그마 41:2(blit 에디토리얼) 반영.
 * 대형 워드마크 + 흩어진 문구 + 빈 미디어 + ● 좌우 엇갈림 섹션.
 * 확정 원고가 없는 부분은 빈칸 플레이스홀더로 유지.
 */
const SECTIONS = [
  { n: "01", title: "추진 배경", note: "introduction 원고 준비 중 (추진배경·문제의식)", media: "이미지 준비 중" },
  { n: "02", title: "온도의 의미", note: "identity 원고 준비 중 (온도의 의미·비전)", media: "이미지 준비 중" },
  { n: "03", title: "운영 프로세스", note: "운영 프로세스 다이어그램 준비 중", media: "다이어그램 준비 중" },
  { n: "04", title: "차별점", note: "차별점 원고 준비 중", media: "이미지 준비 중" },
];

export default function About() {
  return (
    <main>
      {/* ── 히어로: 비대칭 에디토리얼 캔버스 ── */}
      <section className="pb-8 pt-6 lg:pb-9">
        <Container>
          <h1 className="font-display text-display font-bold leading-none tracking-[-0.02em]">
            ABOUT
          </h1>

          {/* 데스크톱: 흩어진 배치 */}
          <div className="mt-7 hidden grid-cols-12 gap-4 lg:grid">
            <p className="col-span-2 col-start-3 text-md">
              무형문화재 보유자의
              <br />
              브랜딩 파트너
            </p>
            <p className="col-span-2 col-start-7 text-md">
              창작에 집중하도록
              <br />
              시장을 연결합니다
            </p>
            <div className="col-span-3 col-start-10 row-span-2">
              <EmptyBlock label="" className="aspect-[8/9] w-full" />
            </div>
            <div className="col-span-3 col-start-2 row-start-2 mt-7">
              <EmptyBlock label="" className="aspect-[3/5] w-full" />
            </div>
            <div aria-hidden="true" className="col-span-2 col-start-7 row-start-2 mt-9 aspect-square bg-text-primary" />
            <div className="col-span-7 col-start-6 row-start-3 mt-8">
              <p className="font-display text-2xl font-bold leading-tight tracking-[-0.02em] lg:text-display">
                전통의 온도를 잇는
                <br />
                소속사, 온도
              </p>
              <p className="mt-6 max-w-2xl text-md text-text-muted">
                ONDO는 무형문화재 보유자가 창작에만 집중할 수 있도록 브랜딩·상품 기획·판매·계약을
                전담하는 전통문화 소속사입니다.
              </p>
            </div>
          </div>

          {/* 모바일: 세로 스택 */}
          <div className="mt-6 flex flex-col gap-6 lg:hidden">
            <p className="text-md text-text-muted">무형문화재 보유자의 브랜딩 파트너</p>
            <EmptyBlock label="" className="aspect-[4/5] w-full" />
            <div>
              <p className="font-display text-2xl font-bold leading-tight tracking-[-0.02em]">
                전통의 온도를 잇는
                <br />
                소속사, 온도
              </p>
              <p className="mt-5 text-md text-text-muted">
                ONDO는 무형문화재 보유자가 창작에만 집중할 수 있도록 브랜딩·상품 기획·판매·계약을
                전담하는 전통문화 소속사입니다.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* ── ● 섹션 (좌우 엇갈림) ── */}
      {SECTIONS.map((s, i) => (
        <section key={s.n} className="pb-8 lg:pb-9">
          <Container>
            <div
              className={`grid items-center gap-6 lg:grid-cols-2 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <EmptyBlock label={s.media} className="aspect-[3/2] w-full" />
              <div>
                <p className="flex items-center gap-2 text-sm text-text-muted">
                  <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
                  {s.n}
                </p>
                <h2 className="mt-2 font-display text-xl font-bold leading-tight tracking-tight lg:text-2xl">
                  {s.title}
                </h2>
                <p className="mt-4 max-w-md text-sm text-text-muted">{s.note}</p>
              </div>
            </div>
          </Container>
        </section>
      ))}
    </main>
  );
}
