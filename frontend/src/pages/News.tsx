import { useState, type CSSProperties } from "react";
import FitCanvas from "../components/ui/FitCanvas";
import NewsLink from "../components/news/NewsLink";
import { getNewsList } from "../api/news";
import { useFetch } from "../hooks/useFetch";
import { NEWS_CATEGORY_LABEL, type NewsCategory, type NewsSummary } from "../types/news";
import { resolveImageUrl } from "../api/client";

/**
 * News · List — Figma 53:2 "News · List / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout).
 * 구성: 대형 헤딩 + 서브타이틀 + 필터칩4 + 뉴스 카드 그리드(3열) + 더보기 버튼.
 *
 * 데이터: GET /api/news. 필터칩 = category 파라미터, 더보기 = size 증가.
 * 카드가 6개 고정이 아니므로 행 수에 따라 캔버스 높이를 계산한다.
 * 백엔드 미기동·자료 없음이면 안내 문구만 띄운다(useFetch 규약).
 *
 * ≥1280: Figma 1440 콘텐츠존을 max-w-[1280px] 캔버스에 절대좌표로 재현. 좌표=(figmaX-80, figmaY-120).
 * <1280: 세로 스택 반응형.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

/** 필터칩 — category가 없으면 '전체'. 폭·좌표는 Figma 값. */
const CHIPS: { label: string; w: number; category?: NewsCategory }[] = [
  { label: "전체", w: 65 },
  { label: "온도 소식", w: 97, category: "ONDO_NEWS" },
  { label: "전통문화", w: 93, category: "TRADITION" },
  { label: "보유자 소식", w: 111, category: "ARTISAN" },
];
const CHIP_LEFT = [0, 75, 182, 285];

/** 카드 안 카테고리 뱃지 폭 — Figma 값. */
const CAT_W: Record<NewsCategory, number> = { ONDO_NEWS: 68, TRADITION: 65, ARTISAN: 79 };

/** 데스크톱 그리드 기하 — 3열, 행 간격 430, 카드 총높이 360(이미지260+뱃지+제목+메타). */
const COLS = [0, 440, 880];
const ROW_Y0 = 338.48;
const ROW_GAP = 430;
const CARD_W = 400;
const CARD_H = 360;
const PAGE_SIZE = 6;

function metaText(n: NewsSummary) {
  const date = new Date(n.publishedAt).toLocaleDateString("ko-KR");
  const source = n.sourceName ? `${n.sourceName} · ` : "";
  const external = n.type === "CURATED" && n.externalUrl ? "  ·  새 탭 이동" : "";
  return `${source}${date}${external}`;
}

/** 카드 썸네일 — 없으면 회색 박스(와이어프레임 톤 유지). */
function Thumb({ news, className }: { news: NewsSummary; className: string }) {
  return news.thumbnailUrl ? (
    <img
      src={resolveImageUrl(news.thumbnailUrl)}
      alt=""
      loading="lazy"
      decoding="async"
      className={`bg-surface-muted object-cover ${className}`}
    />
  ) : (
    <div className={`bg-surface-muted ${className}`} />
  );
}

function CategoryBadge({
  category,
  className = "",
  style,
}: {
  category: NewsCategory;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <span
      className={`flex h-[24px] items-center justify-center rounded-[12px] border border-border-base bg-[#fefefe] text-[12px] text-text-primary ${className}`}
      style={style}
    >
      {NEWS_CATEGORY_LABEL[category]}
    </span>
  );
}

export default function News() {
  const [category, setCategory] = useState<NewsCategory | undefined>(undefined);
  const [size, setSize] = useState(PAGE_SIZE);

  const { data, loading } = useFetch(() => getNewsList({ size, category }), [size, category]);
  const items = data?.content ?? [];
  const hasNext = data?.hasNext ?? false;

  /** 필터 변경 시 더보기로 늘려둔 개수는 초기화한다. */
  const selectCategory = (c?: NewsCategory) => {
    setCategory(c);
    setSize(PAGE_SIZE);
  };

  const rows = Math.max(1, Math.ceil(items.length / 3));
  const loadMoreTop = ROW_Y0 + (rows - 1) * ROW_GAP + 390;
  const canvasH = loadMoreTop + 102;
  const emptyText = loading ? "불러오는 중…" : "표시할 소식이 없습니다.";

  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <FitCanvas w={1280} h={canvasH}>
          {/* Page header */}
          <p className="absolute left-0 top-0 whitespace-nowrap text-[150px] font-bold leading-none text-text-primary">
            News
          </p>
          <p className="absolute left-[5px] top-[182px] whitespace-nowrap text-[20px] text-text-muted">
            온도와 전통문화의 소식을 전합니다.
          </p>

          {/* Filter tabs (247:382) */}
          {CHIPS.map((c, i) => {
            const active = c.category === category;
            return (
              <button
                key={c.label}
                type="button"
                onClick={() => selectCategory(c.category)}
                aria-pressed={active}
                className={`absolute flex h-[44px] items-center justify-center rounded-[22px] border text-[14px] font-medium ${
                  active
                    ? "border-text-primary bg-text-primary text-[#fefefe]"
                    : "border-border-base text-text-primary"
                }`}
                style={{ left: CHIP_LEFT[i], top: 250, width: c.w }}
              >
                {c.label}
              </button>
            );
          })}

          {/* News grid (247:389) — 3열 */}
          {items.length === 0 ? (
            <p
              className="absolute text-[15px] text-text-muted"
              style={{ left: 0, top: ROW_Y0, width: 1280 }}
            >
              {emptyText}
            </p>
          ) : (
            items.map((n, i) => (
              <NewsLink
                key={n.id}
                news={n}
                className="group absolute block"
                style={{
                  left: COLS[i % 3],
                  top: ROW_Y0 + Math.floor(i / 3) * ROW_GAP,
                  width: CARD_W,
                  height: CARD_H,
                }}
              >
                <Thumb news={n} className="absolute left-0 top-0 h-[260px] w-[400px] rounded-[4px]" />
                {n.type === "CURATED" && n.externalUrl && (
                  <span className="absolute left-[300px] top-[16px] w-[84px] text-right text-[12px] font-medium text-text-primary">
                    외부 링크 ↗
                  </span>
                )}
                <CategoryBadge
                  category={n.category}
                  className="absolute"
                  style={{ left: 0, top: 276, width: CAT_W[n.category] }}
                />
                {/*
                  와이어프레임은 자리표시 제목이라 nowrap이었지만 실제 기사 제목은 길다.
                  nowrap을 두면 카드를 넘어 옆 칸을 침범하고, FitCanvas 실측 폭까지 늘려
                  페이지 전체가 축소된다. 2줄로 접는다.
                */}
                <span className="absolute left-0 top-[312px] line-clamp-2 w-[400px] text-[18px] font-medium leading-[1.3] text-text-primary group-hover:underline">
                  {n.title}
                </span>
                <span className="absolute left-0 top-[372px] w-[400px] truncate text-[13px] text-[#999]">
                  {metaText(n)}
                </span>
              </NewsLink>
            ))
          )}

          {/* Load more (247:390) — 다음 페이지가 있을 때만 */}
          {hasNext && (
            <button
              type="button"
              onClick={() => setSize(size + PAGE_SIZE)}
              disabled={loading}
              className="absolute flex h-[52px] items-center justify-center rounded-[26px] border border-border-base bg-[#fefefe] text-[15px] font-medium text-text-primary disabled:opacity-50"
              style={{ left: 540, top: loadMoreTop, width: 200 }}
            >
              {loading ? "불러오는 중…" : "다음 소식 보기"}
            </button>
          )}
        </FitCanvas>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6">
          <h1 className="whitespace-nowrap text-[clamp(56px,15vw,150px)] font-bold leading-none text-text-primary">
            News
          </h1>
          <p className="mt-4 text-[clamp(16px,4vw,20px)] text-text-muted">
            온도와 전통문화의 소식을 전합니다.
          </p>

          {/* 필터칩 */}
          <div className="mt-8 flex flex-wrap gap-[10px]">
            {CHIPS.map((c) => {
              const active = c.category === category;
              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => selectCategory(c.category)}
                  aria-pressed={active}
                  className={`flex h-[44px] items-center justify-center rounded-[22px] border px-4 text-[14px] font-medium ${
                    active
                      ? "border-text-primary bg-text-primary text-[#fefefe]"
                      : "border-border-base text-text-primary"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* 카드 그리드 */}
          {items.length === 0 ? (
            <p className="mt-8 text-[15px] text-text-muted">{emptyText}</p>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-x-[40px] gap-y-[30px] sm:grid-cols-2 lg:grid-cols-3">
              {items.map((n) => (
                <NewsLink key={n.id} news={n} className="group block">
                  <div className="relative aspect-[400/260] w-full">
                    <Thumb news={n} className="absolute inset-0 h-full w-full rounded-[4px]" />
                    {n.type === "CURATED" && n.externalUrl && (
                      <span className="absolute right-4 top-4 text-[12px] font-medium text-text-primary">
                        외부 링크 ↗
                      </span>
                    )}
                  </div>
                  <CategoryBadge category={n.category} className="mt-4 w-fit px-[10px]" />
                  <p className="mt-3 line-clamp-2 text-[18px] font-medium leading-[1.3] text-text-primary group-hover:underline">
                    {n.title}
                  </p>
                  <p className="mt-1.5 truncate text-[13px] text-[#999]">{metaText(n)}</p>
                </NewsLink>
              ))}
            </div>
          )}

          {/* 더보기 */}
          {hasNext && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setSize(size + PAGE_SIZE)}
                disabled={loading}
                className="flex h-[52px] w-[200px] items-center justify-center rounded-[26px] border border-border-base bg-[#fefefe] text-[15px] font-medium text-text-primary disabled:opacity-50"
              >
                {loading ? "불러오는 중…" : "다음 소식 보기"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
