import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, getProducts } from "../api/products";
import { useFetch } from "../hooks/useFetch";
import { PRODUCT_CATEGORY_LABEL, priceText } from "../types/product";
import { resolveImageUrl } from "../api/client";
import Container from "../components/layout/Container";
import Markdown from "../components/ui/Markdown";
import Skeleton from "../components/ui/Skeleton";

/**
 * Product Detail — Figma 49:2 "Product Detail / Desktop / Wireframe (blit)".
 * Header/Footer/BackgroundPattern은 공통(Layout).
 * 구성: 브레드크럼 + 갤러리(560×700 + 썸네일4) / 상품정보(628, 보유자 카드·수량·구매) + 스토리 + 관련상품.
 *
 * 데이터: GET /api/products/{slug}. 관련 상품은 같은 보유자의 다른 상품(GET /api/products?artisan=).
 *
 * 시안은 절대좌표 캔버스였지만 설명·스토리 길이와 이미지·관련상품 개수가 상품마다 다르다.
 * 고정 높이 캔버스에서는 긴 글이 잘리고 짧으면 빈 공간이 남으므로, 같은 치수
 * (갤러리 560 · 정보 628 · 간격 72 · 4:5 이미지)를 유지한 흐름 배치로 옮겼다.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading, error } = useFetch(() => getProduct(slug!), [slug]);

  // 관련 상품은 상품을 받아야 보유자를 알 수 있다 — 훅은 조건 없이 걸고 안에서 분기한다.
  const artisanSlug = data?.artisan.slug;
  const { data: relatedPage } = useFetch(
    () => (artisanSlug ? getProducts({ artisan: artisanSlug, size: 4 }) : Promise.resolve(null)),
    [artisanSlug],
  );

  const [imageIdx, setImageIdx] = useState(0);
  const [qty, setQty] = useState(1);

  if (loading) {
    return (
      <main>
        <Container className="py-8">
          <Skeleton className="h-4 w-72" />
          <div className="mt-6 grid grid-cols-1 gap-8 xl:grid-cols-[560px_628px] xl:gap-x-[72px]">
            <Skeleton className="aspect-[560/700] w-full" />
            <div>
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="mt-4 h-8 w-40" />
              <Skeleton className="mt-6 h-24 w-full" />
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main>
        <Container className="py-9 text-center">
          <h1 className="text-[22px] font-bold text-text-primary">상품을 불러오지 못했습니다</h1>
          <p className="mt-3 text-[14px] text-text-muted">{error}</p>
          <Link to="/shop" className="mt-6 inline-block text-[14px] underline underline-offset-4">
            Shop으로 돌아가기
          </Link>
        </Container>
      </main>
    );
  }

  /** 대표 이미지 + 상세 이미지를 한 갤러리로 합친다(중복 제거). */
  const gallery = [data.thumbnailUrl, ...data.images.map((i) => i.imageUrl)].filter(
    (url, i, arr): url is string => !!url && arr.indexOf(url) === i,
  );
  const mainImage = gallery[Math.min(imageIdx, gallery.length - 1)];

  const related = (relatedPage?.content ?? []).filter((p) => p.slug !== data.slug).slice(0, 3);
  const maxQty = data.stockQuantity > 0 ? data.stockQuantity : 1;
  const purchasable = data.status === "ON_SALE";

  return (
    <main style={{ fontFamily: INTER }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-6 sm:px-6 lg:px-5">
        {/* 브레드크럼 — 보유자 상세 라우트가 아직 없어 보유자는 링크하지 않는다. */}
        <p className="whitespace-pre-wrap text-[14px] text-text-muted">
          <Link to="/shop" className="underline-offset-4 hover:underline">
            Shop
          </Link>
          {`  ›  ${data.artisan.name} · ${data.artisan.title}  ›  ${data.name}`}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-10 xl:grid-cols-[560px_628px] xl:gap-x-[72px]">
          {/* ── Gallery (245:381) ── */}
          <div>
            {mainImage ? (
              <img
                src={resolveImageUrl(mainImage)}
                alt={data.name}
                className="aspect-[560/700] w-full bg-surface-muted object-cover"
              />
            ) : (
              <div className="flex aspect-[560/700] w-full items-center justify-center bg-surface-muted">
                <span className="text-[14px] text-[#999]">상품 이미지 4:5 — 준비 중</span>
              </div>
            )}

            {gallery.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-[16px]">
                {gallery.slice(0, 4).map((url, i) => (
                  <button
                    key={url}
                    type="button"
                    onClick={() => setImageIdx(i)}
                    aria-label={`${data.name} 이미지 ${i + 1}`}
                    aria-pressed={i === imageIdx}
                    className={`aspect-square w-full overflow-hidden bg-surface-muted ${
                      i === imageIdx ? "outline outline-2 outline-text-primary" : ""
                    }`}
                  >
                    <img
                      src={resolveImageUrl(url)}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info (245:383) ── */}
          <div>
            <p className="flex items-center gap-2 text-[14px] font-medium text-text-muted">
              <span aria-hidden="true" className="h-[10px] w-[10px] rounded-full bg-accent" />
              {`${data.category} · ${PRODUCT_CATEGORY_LABEL[data.category]}`}
            </p>
            <h1 className="mt-3 text-[clamp(30px,8vw,42px)] font-bold text-text-primary">{data.name}</h1>
            <p className="mt-3 text-[clamp(24px,6vw,30px)] font-bold text-text-primary">
              {priceText(data)}
            </p>
            {data.summary && (
              <p className="mt-5 text-[17px] leading-[1.6] text-text-muted">{data.summary}</p>
            )}

            {/* Artisan card (245:382) */}
            <div className="mt-6 flex items-center gap-4 rounded-[16px] border border-border-base bg-[#fefefe] p-5">
              {data.artisan.profileImageUrl ? (
                <img
                  src={resolveImageUrl(data.artisan.profileImageUrl)}
                  alt=""
                  className="h-[60px] w-[60px] shrink-0 rounded-full bg-surface-muted object-cover"
                />
              ) : (
                <div className="h-[60px] w-[60px] shrink-0 rounded-full bg-surface-muted" />
              )}
              <div className="min-w-0">
                <p className="text-[16px] font-bold text-text-primary">
                  {`${data.artisan.name}  ${data.artisan.title}`}
                </p>
                <p className="mt-1 text-[14px] text-text-muted">{data.artisan.shortIntro}</p>
              </div>
            </div>

            {/* 수량 — 재고 범위 안에서만 조절한다. */}
            <p className="mt-6 text-[14px] font-medium text-text-primary">수량</p>
            <div className="mt-2 flex h-[48px] w-[110px] items-center justify-between rounded-[8px] border border-border-base bg-[#fefefe] px-3">
              <button
                type="button"
                onClick={() => setQty((v) => Math.max(1, v - 1))}
                disabled={!purchasable || qty <= 1}
                aria-label="수량 줄이기"
                className="text-[18px] leading-none text-text-primary disabled:opacity-30"
              >
                −
              </button>
              <span className="text-[15px] text-text-primary">{qty}</span>
              <button
                type="button"
                onClick={() => setQty((v) => Math.min(maxQty, v + 1))}
                disabled={!purchasable || qty >= maxQty}
                aria-label="수량 늘리기"
                className="text-[18px] leading-none text-text-primary disabled:opacity-30"
              >
                +
              </button>
            </div>

            {/* 구매 — 상태에 따라 갈린다. 품절이면 누를 수 없고, 문의 전용은 협업문의로 보낸다. */}
            {data.status === "SOLD_OUT" ? (
              <span className="mt-5 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-surface-muted text-[16px] font-medium text-[#999]">
                품절
              </span>
            ) : data.status === "INQUIRY_ONLY" ? (
              <Link
                to="/collaboration"
                className="mt-5 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary"
              >
                주문 문의
              </Link>
            ) : (
              <Link
                to="/order"
                className="mt-5 flex h-[56px] w-full items-center justify-center rounded-[28px] bg-primary text-[16px] font-medium text-text-primary"
              >
                주문하기
              </Link>
            )}

            {data.externalUrl && (
              <p className="mt-3 text-center">
                <a
                  href={data.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[14px] text-text-muted underline-offset-4 hover:underline"
                >
                  외부 판매처에서 보기 ↗
                </a>
              </p>
            )}
          </div>
        </div>

        {/* ── Story (245:384) ── */}
        <div className="mt-12 border-t border-border-base pt-10">
          <p className="flex items-center gap-2 text-[14px] font-medium text-text-muted">
            <span aria-hidden="true" className="h-[10px] w-[10px] rounded-full bg-accent" />
            STORY
          </p>
          <h2 className="mt-3 text-[clamp(26px,7vw,34px)] font-bold text-text-primary">상품 이야기</h2>
          <div className="mt-6 text-text-primary">
            {data.description?.trim() ? (
              <Markdown text={data.description} />
            ) : (
              <p className="text-[14px] text-[#999]">상세 설명이 아직 등록되지 않았습니다.</p>
            )}
          </div>
        </div>

        {/* ── Related / products (245:388) — 같은 보유자의 다른 상품 ── */}
        {related.length > 0 && (
          <div className="mt-12">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[clamp(22px,6vw,30px)] font-bold text-text-primary">
                {data.artisan.name}의 다른 상품
              </h2>
              <Link
                to="/shop"
                className="whitespace-nowrap text-[14px] text-text-primary underline-offset-4 hover:underline"
              >
                전체 보기
              </Link>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-x-[10px] gap-y-8 sm:grid-cols-3">
              {related.map((p) => (
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
                  <p className="mt-4 text-center text-[12px] text-[#999]">{p.artisanName}</p>
                  <p className="mt-1 text-center text-[15px] font-medium text-text-primary group-hover:underline">
                    {p.name}
                  </p>
                  <p className="mt-1 text-center text-[14px] font-bold text-text-primary">
                    {priceText(p)}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
