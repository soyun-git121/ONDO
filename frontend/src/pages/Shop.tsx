import { useState } from "react";
import { Link } from "react-router-dom";
import FitCanvas from "../components/ui/FitCanvas";
import { getProducts } from "../api/products";
import { getArtisans } from "../api/artisans";
import { useFetch } from "../hooks/useFetch";
import { priceText } from "../types/product";
import type { ProductSort, ProductSummary } from "../types/product";
import { resolveImageUrl } from "../api/client";

/**
 * Shop — Figma 46:2 "Shop / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout). 본문 = 대형 헤딩 + Featured 배너 +
 * 툴바 + 보유자 필터 사이드바 + 상품 그리드(3열).
 *
 * 데이터: GET /api/products (artisan·sort·size) + GET /api/artisans (필터 라벨).
 * 상품 수가 9개 고정이 아니므로 행 수에 따라 캔버스 높이를 계산한다.
 *
 * ≥1280: Figma 1440 콘텐츠존을 max-w-[1280px] 캔버스에 절대좌표로 재현.
 *        좌표 = (figmaX-80, figmaY-120). <1280: 세로 스택 반응형.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

/** 그리드 기하 — 3열, 카드 310×310 이미지 + 하단 텍스트 4줄. */
const COLS = [306.2, 641.2, 976.2];
const ROW_Y0 = 666.89;
const ROW_GAP = 500;
const CARD_W = 310;
const CARD_H = 420;
/** 사이드바 마지막 행 하단 — 상품이 적어도 캔버스가 이보다 짧아지면 안 된다. */
const SIDEBAR_BOTTOM = 830;
const PAGE_SIZE = 9;

/** 카운트 집계용 조회 상한. 카탈로그가 이보다 커지면 전용 집계 API가 필요하다. */
const COUNT_FETCH_SIZE = 200;

const SORTS: { value: ProductSort; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "priceAsc", label: "가격 낮은순" },
  { value: "priceDesc", label: "가격 높은순" },
];

const LINE3 = {
  price: "text-[14px] font-bold text-text-primary",
  muted: "text-[14px] font-bold text-[#999]",
  inquiry: "text-[13px] font-medium leading-[1.6] text-text-primary",
};

/** 상태별 표시 규칙 — 가격줄/뱃지/CTA는 status 하나에서 파생된다. 문구는 types/product.ts가 정본. */
function priceLine(p: ProductSummary) {
  if (p.status === "INQUIRY_ONLY") return { text: priceText(p), cls: LINE3.inquiry };
  if (p.status === "SOLD_OUT") return { text: priceText(p), cls: LINE3.muted };
  return { text: priceText(p), cls: LINE3.price };
}
function ctaOf(p: ProductSummary) {
  if (p.status === "ON_SALE") return "주문하기";
  if (p.status === "INQUIRY_ONLY") return "문의하기";
  return undefined;
}

/** 상품 썸네일 — 없으면 회색 박스(와이어프레임 톤 유지). */
function Thumb({ p, className }: { p: ProductSummary; className: string }) {
  return p.thumbnailUrl ? (
    <img
      src={resolveImageUrl(p.thumbnailUrl)}
      alt=""
      loading="lazy"
      decoding="async"
      className={`bg-surface-muted object-cover ${className}`}
    />
  ) : (
    <div className={`bg-surface-muted ${className}`} />
  );
}

export default function Shop() {
  const [artisan, setArtisan] = useState<string | undefined>(undefined);
  const [sort, setSort] = useState<ProductSort>("latest");
  const [size, setSize] = useState(PAGE_SIZE);

  const { data: page, loading } = useFetch(
    () => getProducts({ size, artisan, sort }),
    [size, artisan, sort],
  );
  const { data: artisanPage } = useFetch(() => getArtisans({ size: 50 }), []);
  // 사이드바 보유자별 건수 — 그리드와 별개로 전체 카탈로그를 한 번만 훑어 집계한다.
  const { data: catalog } = useFetch(() => getProducts({ size: COUNT_FETCH_SIZE }), []);

  const items = page?.content ?? [];
  const total = page?.totalElements ?? 0;
  const hasNext = page?.hasNext ?? false;

  /** artisanSlug → "윤종국 · 악기장". ProductSummary에는 종목(title)이 없어 보유자 API에서 채운다. */
  const artisans = artisanPage?.content ?? [];
  const brandOf = (p: ProductSummary) => {
    const a = artisans.find((x) => x.slug === p.artisanSlug);
    return a ? `${a.name} · ${a.title}` : p.artisanName;
  };

  const counts = new Map<string, number>();
  for (const p of catalog?.content ?? []) {
    counts.set(p.artisanSlug, (counts.get(p.artisanSlug) ?? 0) + 1);
  }
  const filters = [
    { slug: undefined as string | undefined, label: "전체", count: catalog?.totalElements ?? 0 },
    ...artisans.map((a) => ({
      slug: a.slug,
      label: `${a.name} · ${a.title}`,
      count: counts.get(a.slug) ?? 0,
    })),
  ];

  const select = (slug?: string) => {
    setArtisan(slug);
    setSize(PAGE_SIZE);
  };
  const changeSort = (s: ProductSort) => {
    setSort(s);
    setSize(PAGE_SIZE);
  };

  const rows = Math.max(1, Math.ceil(items.length / 3));
  const gridBottom = ROW_Y0 + (rows - 1) * ROW_GAP + CARD_H;
  const canvasH = Math.max(gridBottom, SIDEBAR_BOTTOM) + 60;
  const rangeText = total === 0 ? "상품 없음" : `전체 ${total}점 중 1–${items.length}`;
  const emptyText = loading ? "불러오는 중…" : "등록된 상품이 없습니다.";

  /** 데스크톱 상품 카드 — 카드 전체가 상세 링크. 좌표는 Figma 그대로. */
  const desktopCard = (p: ProductSummary, i: number) => {
    const line = priceLine(p);
    const cta = ctaOf(p);
    return (
      <Link
        key={p.id}
        to={`/shop/${p.slug}`}
        className="group absolute block"
        style={{
          left: COLS[i % 3],
          top: ROW_Y0 + Math.floor(i / 3) * ROW_GAP,
          width: CARD_W,
          height: CARD_H,
        }}
      >
        <Thumb p={p} className="absolute left-0 top-0 h-[310px] w-[310px]" />
        {p.status === "SOLD_OUT" && (
          <span className="absolute left-[271px] top-[16px] whitespace-nowrap text-[12px] font-medium text-[#999]">
            품절
          </span>
        )}
        <span className="absolute left-0 top-[328px] w-[310px] truncate text-center text-[12px] text-[#999]">
          {brandOf(p)}
        </span>
        <span className="absolute left-0 top-[348px] w-[310px] truncate text-center text-[15px] font-medium text-text-primary group-hover:underline">
          {p.name}
        </span>
        <span className={`absolute left-0 top-[374px] w-[310px] text-center ${line.cls}`}>
          {line.text}
        </span>
        {cta && (
          <span className="absolute left-0 top-[402px] w-[310px] text-center text-[12px] text-text-muted">
            {cta}
          </span>
        )}
      </Link>
    );
  };

  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <FitCanvas w={1280} h={canvasH}>
          {/* 헤딩 — 46:7 */}
          <h1
            className="absolute whitespace-nowrap text-[150px] font-bold leading-none text-text-primary"
            style={{ left: 18, top: 0 }}
          >
            Shop
          </h1>

          {/* ── Featured / banner (244:392) ──
              Product에 featured 플래그가 없어 배너 문구는 정적. 큐레이션을 데이터로 빼려면
              엔티티에 isFeatured 추가가 선행돼야 한다. */}
          <div className="absolute bg-surface-muted" style={{ left: 306.2, top: 336.89, width: 980, height: 240 }} />
          <Link
            to="/collaboration"
            className="absolute whitespace-nowrap text-[12px] font-medium text-text-primary hover:underline"
            style={{ left: 1217, top: 302 }}
          >
            주문문의
          </Link>
          {/*
            배너 문구는 회색 박스(left 306.2, w 980) 폭에 걸고 text-center로 가운데를 잡는다.
            Figma 좌표를 left에 그대로 박으면 그때 잰 글자 길이에서만 가운데가 맞아,
            문구를 고치는 순간 어긋난다(실제로 최대 107px까지 왼쪽으로 밀려 있었다).
            세로 위치(top)는 시안 그대로 둔다.
          */}
          <p className="absolute text-center text-[14px] font-medium text-text-muted" style={{ left: 306.2, top: 388.89, width: 980 }}>
            FEATURED
          </p>
          <p className="absolute text-center text-[40px] font-bold text-text-primary" style={{ left: 306.2, top: 412.89, width: 980 }}>
            보유자의 손끝, 온도
          </p>
          <p className="absolute text-center text-[15px] leading-[1.6] text-text-muted" style={{ left: 306.2, top: 478.89, width: 980 }}>
            이 계절 온도가 추천하는 보유자의 작품
          </p>

          {/* ── Toolbar (244:393) ── */}
          <p className="absolute whitespace-pre text-[14px] text-text-primary" style={{ left: 306.2, top: 604.89 }}>
            {"▦  ☰   사이드바"}
          </p>
          <label className="absolute flex items-center gap-1 text-[14px] text-text-primary" style={{ left: 486.2, top: 604.89 }}>
            정렬:
            <select
              value={sort}
              onChange={(e) => changeSort(e.target.value as ProductSort)}
              className="cursor-pointer bg-transparent text-[14px] text-text-primary"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
          <p className="absolute text-right text-[13px] text-text-muted" style={{ left: 1126.2, top: 606.89, width: 160 }}>
            {rangeText}
          </p>
          <div className="absolute bg-border-base" style={{ left: 306.2, top: 642.89, width: 980, height: 1 }} />

          {/* ── Filter / sidebar (244:391) ── */}
          <p className="absolute whitespace-nowrap text-[15px] font-bold text-text-primary" style={{ left: -17, top: 577 }}>
            보유자
          </p>
          <div className="absolute bg-text-primary" style={{ left: -17, top: 605, width: 26, height: 3 }} />
          <p className="absolute whitespace-nowrap text-[12px] text-[#999]" style={{ left: -17, top: 617 }}>
            장인별 필터
          </p>
          {filters.map((f, i) => {
            const active = f.slug === artisan;
            return (
              <button
                key={f.label}
                type="button"
                onClick={() => select(f.slug)}
                aria-pressed={active}
                className={`absolute flex items-center justify-between whitespace-nowrap text-[14px] ${
                  active ? "font-medium text-text-primary" : "text-text-muted"
                }`}
                style={{ left: -17, top: 657 + i * 36, width: 270 }}
              >
                <span>{f.label}</span>
                <span className="text-[12px] text-[#999]">{f.count}</span>
              </button>
            );
          })}

          {/* ── Product grid (244:390) — 3열 ── */}
          {items.length === 0 ? (
            <p className="absolute text-[15px] text-text-muted" style={{ left: COLS[0], top: ROW_Y0, width: 980 }}>
              {emptyText}
            </p>
          ) : (
            items.map(desktopCard)
          )}

          {hasNext && (
            <button
              type="button"
              onClick={() => setSize(size + PAGE_SIZE)}
              disabled={loading}
              className="absolute flex h-[52px] items-center justify-center rounded-[26px] border border-border-base bg-[#fefefe] text-[15px] font-medium text-text-primary disabled:opacity-50"
              style={{ left: 696, top: gridBottom + 8, width: 200 }}
            >
              {loading ? "불러오는 중…" : "상품 더 보기"}
            </button>
          )}
        </FitCanvas>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6">
          <h1 className="whitespace-nowrap text-[clamp(56px,15vw,150px)] font-bold leading-none text-text-primary">
            Shop
          </h1>

          {/* Featured 배너 */}
          <div className="mt-8 bg-surface-muted px-6 py-10 text-center">
            <p className="text-[14px] font-medium text-text-muted">FEATURED</p>
            <p className="mt-2 text-[clamp(24px,7vw,40px)] font-bold text-text-primary">보유자의 손끝, 온도</p>
            <p className="mt-3 text-[15px] leading-[1.6] text-text-muted">
              이 계절 온도가 추천하는 보유자의 작품
            </p>
          </div>

          {/* 필터 */}
          <div className="mt-8">
            <p className="text-[15px] font-bold text-text-primary">보유자</p>
            <div className="mt-1 h-[3px] w-[26px] bg-text-primary" />
            <p className="mt-2 text-[12px] text-[#999]">장인별 필터</p>
            <ul className="mt-4 flex flex-col gap-2">
              {filters.map((f) => {
                const active = f.slug === artisan;
                return (
                  <li key={f.label}>
                    <button
                      type="button"
                      onClick={() => select(f.slug)}
                      aria-pressed={active}
                      className="flex w-full items-center justify-between"
                    >
                      <span className={`text-[14px] ${active ? "font-medium text-text-primary" : "text-text-muted"}`}>
                        {f.label}
                      </span>
                      <span className="text-[12px] text-[#999]">{f.count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* 툴바 */}
          <div className="mt-8 flex items-center justify-between border-b border-border-base pb-3">
            <label className="flex items-center gap-1 text-[14px] text-text-primary">
              정렬:
              <select
                value={sort}
                onChange={(e) => changeSort(e.target.value as ProductSort)}
                className="cursor-pointer bg-transparent text-[14px] text-text-primary"
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
            <span className="whitespace-nowrap text-[13px] text-text-muted">{rangeText}</span>
          </div>

          {/* 상품 그리드 */}
          {items.length === 0 ? (
            <p className="mt-6 text-[15px] text-text-muted">{emptyText}</p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-x-[25px] gap-y-8 sm:grid-cols-3">
              {items.map((p) => {
                const line = priceLine(p);
                const cta = ctaOf(p);
                return (
                  <Link key={p.id} to={`/shop/${p.slug}`} className="group block">
                    <div className="relative aspect-square w-full">
                      <Thumb p={p} className="absolute inset-0 h-full w-full" />
                      {p.status === "SOLD_OUT" && (
                        <span className="absolute right-2 top-2 text-[12px] font-medium text-[#999]">품절</span>
                      )}
                    </div>
                    <p className="mt-4 truncate text-center text-[12px] text-[#999]">{brandOf(p)}</p>
                    <p className="mt-1 truncate text-center text-[15px] font-medium text-text-primary group-hover:underline">
                      {p.name}
                    </p>
                    <p className={`mt-1.5 text-center ${line.cls}`}>{line.text}</p>
                    {cta && <p className="mt-1.5 text-center text-[12px] text-text-muted">{cta}</p>}
                  </Link>
                );
              })}
            </div>
          )}

          {hasNext && (
            <div className="mt-10 flex justify-center">
              <button
                type="button"
                onClick={() => setSize(size + PAGE_SIZE)}
                disabled={loading}
                className="flex h-[52px] w-[200px] items-center justify-center rounded-[26px] border border-border-base bg-[#fefefe] text-[15px] font-medium text-text-primary disabled:opacity-50"
              >
                {loading ? "불러오는 중…" : "상품 더 보기"}
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
