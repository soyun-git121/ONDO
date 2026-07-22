import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { getNewsList } from "../api/news";
import { useFetch } from "../hooks/useFetch";
import { NEWS_CATEGORY_LABEL, type NewsSummary } from "../types/news";
import EmptyBlock from "../components/ui/EmptyBlock";
import Logo from "../components/ui/Logo";

/**
 * 홈 — Figma 107:80 "05 홈 / Desktop / Wireframe (blit)" 충실 이식.
 * 색·폰트·간격은 프로젝트 토큰(tokens.css / Pretendard / 라임 brand) 기준,
 * 레이아웃·타이포 위계·문구는 Figma 좌표 그대로.
 *
 * ≥1280(노트북/데스크톱): Figma 1440 캔버스의 콘텐츠 존(x80~1360 = 1280px)을
 *   max-w-[1280px] 캔버스에 절대 좌표로 1:1 재현. 좌표 = (figmaX-80, figmaY-34).
 * <1280: 동일 요소를 세로 스택으로 반응형 재배치.
 *
 * 데이터: 프로젝트는 아직 없음 → 빈 플레이스홀더. 뉴스는 실제 /news API(네이버 임포트).
 */

/** ● 라임 도트 + 라벨 아이브로우 (blit) */
function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`flex items-center gap-2 text-sm font-medium ${className}`}>
      <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
      {children}
    </span>
  );
}

/** 뉴스 링크 래퍼 — CURATED(외부 기사)는 새 탭, ORIGINAL은 상세로 (api.md §5) */
function NewsLink({
  news,
  className,
  children,
}: {
  news: NewsSummary;
  className?: string;
  children: ReactNode;
}) {
  if (news.type === "CURATED" && news.externalUrl) {
    return (
      <a href={news.externalUrl} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={`/news/${news.id}`} className={className}>
      {children}
    </Link>
  );
}

function NewsMedia({ news, className }: { news: NewsSummary; className: string }) {
  return news.thumbnailUrl ? (
    <img
      src={news.thumbnailUrl}
      alt={news.title}
      loading="lazy"
      className={`rounded-md bg-surface-muted object-cover ${className}`}
    />
  ) : (
    <EmptyBlock label="이미지 준비 중" className={className} />
  );
}

function newsMeta(news: NewsSummary) {
  return `${NEWS_CATEGORY_LABEL[news.category]} · ${new Date(news.publishedAt).toLocaleDateString("ko-KR")}`;
}

export default function Home() {
  const { data: newsPage, loading: newsLoading } = useFetch(() => getNewsList({ size: 2 }), []);
  const news = newsPage?.content ?? [];

  /** 데스크톱 News+ 슬롯 — 데이터 있으면 뉴스 링크, 없으면 빈 박스(와이어프레임 유지). */
  const desktopNewsSlot = (item: NewsSummary | undefined, posClass: string, mediaClass: string) => {
    if (!item) {
      return (
        <div className={posClass}>
          <Eyebrow>News+</Eyebrow>
          <EmptyBlock
            label={newsLoading ? "불러오는 중…" : "뉴스 준비 중"}
            className={`mt-3 ${mediaClass}`}
          />
        </div>
      );
    }
    return (
      <NewsLink news={item} className={`group block ${posClass}`}>
        <Eyebrow>News+</Eyebrow>
        <span className="mt-2 block text-lg font-bold leading-snug group-hover:underline">
          {item.title}
        </span>
        <NewsMedia news={item} className={`mt-3 ${mediaClass}`} />
        <span className="mt-2 block text-xs text-text-muted">{newsMeta(item)}</span>
      </NewsLink>
    );
  };

  return (
    <main>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대 좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <div className="relative mx-auto h-[3080px] max-w-[1280px]">
          {/* 대형 ONDO 워드마크 — figma 253:749 (logo.svg, 560×187) */}
          <Logo className="absolute left-[-6px] top-0 h-[187px] w-[560px] object-contain object-left-top" />

          {/* 히어로 스캐터 캡션 — figma 107:116 / 107:118 */}
          <p className="absolute left-[246px] top-[277px] w-[200px] text-md leading-tight">
            전통의 온도를
            <br />
            잇습니다
          </p>
          <p className="absolute left-[792px] top-[237px] w-[170px] text-base leading-tight">
            소비되는 전통을
            <br />
            만듭니다
          </p>

          {/* 히어로 미디어 — figma 107:120 (좌 세로형) · 107:122 (우) · 107:121 (검정 사각) */}
          <Eyebrow className="absolute left-[-9px] top-[324px]">Project 1</Eyebrow>
          <EmptyBlock label="" className="absolute left-[-9px] top-[355px] h-[449px] w-[290px]" />

          <EmptyBlock label="" className="absolute left-[980px] top-[177px] h-[356px] w-[340px]" />
          <Eyebrow className="absolute left-[980px] top-[549px]">Project 1</Eyebrow>

          <div
            aria-hidden="true"
            className="absolute left-[725px] top-[462px] h-[178px] w-[195px] bg-text-primary"
          />

          {/* 대형 디스플레이 헤딩 — figma 193:2 / 193:3 (72px) */}
          <h1 className="absolute left-[620px] top-[695px] font-display text-[72px] font-bold leading-[1.08] tracking-[-0.02em]">
            전통의 온도를 잇는
            <br />
            소속사, 온도
          </h1>
          {/* 본문 — figma 193:4 */}
          <p className="absolute left-[620px] top-[907px] w-[700px] text-base leading-base text-text-muted">
            ONDO는 무형문화재 보유자가 창작에만 집중할 수 있도록 브랜딩·상품 기획·판매·계약을 전담하는 전통문화 소속사입니다.
          </p>

          {/* 타글라인 — figma 43:5 / 43:6 */}
          <p className="absolute left-[347px] top-[971px] w-[220px] text-base leading-tight">
            무형문화재 보유자의
            <br />
            브랜딩 파트너
          </p>
          <p className="absolute left-[747px] top-[1398px] w-[220px] text-base leading-tight">
            창작에 집중하도록
            <br />
            시장을 연결합니다
          </p>

          {/* 프로젝트 쇼케이스 (데이터 준비 중) — figma 107:128 / 107:101 */}
          <Eyebrow className="absolute left-[136px] top-[1146px]">Project 2</Eyebrow>
          <EmptyBlock label="" className="absolute left-[136px] top-[1176px] h-[337px] w-[380px]" />

          <Eyebrow className="absolute left-[820px] top-[1589px]">Project</Eyebrow>
          <EmptyBlock label="" className="absolute left-[820px] top-[1624px] h-[309px] w-[500px]" />

          {/* News+ — figma 107:146 divider → 비대칭 뉴스 2슬롯(항상 표시, 데이터 없으면 빈 박스) */}
          <div className="absolute left-[-28px] top-[2081px] w-[1280px] border-t border-border-base" />

          {/* 좌: 가로형 (500×309) — figma 107:139 */}
          {desktopNewsSlot(news[0], "absolute left-0 top-[2218px] w-[500px]", "h-[309px] w-[500px]")}

          {/* 우: 세로로 긴 박스 (278×623) — figma 107:85, footer 바로 위 */}
          {desktopNewsSlot(
            news[1],
            "absolute left-[680px] top-[2346px] w-[278px]",
            "h-[623px] w-[278px]",
          )}
        </div>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto w-full max-w-[1280px] px-3 py-8 lg:px-5">
          {/* 대형 워드마크 (logo.svg) */}
          <Logo className="h-auto w-[min(560px,86vw)]" />

          {/* 스캐터 캡션 (스택에선 나란히) */}
          <div className="mt-6 flex flex-wrap gap-x-12 gap-y-2 text-md leading-tight">
            <p>전통의 온도를 잇습니다</p>
            <p className="text-base">소비되는 전통을 만듭니다</p>
          </div>

          {/* 헤딩 + 본문 */}
          <h1 className="mt-8 font-display text-[clamp(40px,9vw,72px)] font-bold leading-[1.08] tracking-[-0.02em]">
            전통의 온도를 잇는
            <br />
            소속사, 온도
          </h1>
          <p className="mt-5 max-w-[640px] text-base leading-base text-text-muted">
            ONDO는 무형문화재 보유자가 창작에만 집중할 수 있도록 브랜딩·상품 기획·판매·계약을 전담하는 전통문화 소속사입니다.
          </p>

          {/* 히어로 미디어 (Project 1) */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <Eyebrow>Project 1</Eyebrow>
              <EmptyBlock label="" className="mt-3 aspect-[290/449] w-full" />
            </div>
            <div>
              <Eyebrow>Project 1</Eyebrow>
              <EmptyBlock label="" className="mt-3 aspect-[340/356] w-full" />
            </div>
          </div>

          {/* 타글라인 */}
          <div className="mt-8 flex flex-col gap-4 text-base leading-tight sm:flex-row sm:gap-16">
            <p>
              무형문화재 보유자의
              <br />
              브랜딩 파트너
            </p>
            <p>
              창작에 집중하도록
              <br />
              시장을 연결합니다
            </p>
          </div>

          {/* 프로젝트 쇼케이스 */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Eyebrow>Project 2</Eyebrow>
              <EmptyBlock label="" className="mt-3 aspect-[380/337] w-full" />
            </div>
            <div>
              <Eyebrow>Project</Eyebrow>
              <EmptyBlock label="" className="mt-3 aspect-[500/309] w-full" />
            </div>
          </div>

          {/* News+ */}
          <div className="mt-8 border-t border-border-base pt-8">
            <Eyebrow className="text-base font-bold">News+</Eyebrow>
            {news.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-2">
                {news.map((n) => (
                  <NewsLink key={n.id} news={n} className="group block">
                    <span className="block text-lg font-bold leading-snug group-hover:underline">
                      {n.title}
                    </span>
                    <NewsMedia news={n} className="mt-3 aspect-[3/2] w-full" />
                    <span className="mt-2 block text-xs text-text-muted">{newsMeta(n)}</span>
                  </NewsLink>
                ))}
              </div>
            ) : (
              <EmptyBlock
                label={newsLoading ? "불러오는 중…" : "뉴스 준비 중"}
                className="mt-5 h-48"
              />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
