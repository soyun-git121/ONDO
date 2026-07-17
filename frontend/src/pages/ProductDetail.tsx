import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getProduct, getProducts } from "../api/products";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import EmptyBlock from "../components/ui/EmptyBlock";
import Skeleton from "../components/ui/Skeleton";
import Markdown from "../components/ui/Markdown";
import Button from "../components/ui/Button";
import ProductCard from "../components/cards/ProductCard";
import SectionHeading from "../components/ui/SectionHeading";
import { PRODUCT_CATEGORY_LABEL } from "../types/product";
import type { PageResponse } from "../types/common";
import type { ProductSummary } from "../types/product";

/**
 * 상품 상세 — 피그마 49:2(blit) 반영.
 * ● 카테고리 아이브로우 · 보유자 연결 카드 · status 분기 · 상품 이야기 · 다른 상품 그리드.
 */
export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, loading, error } = useFetch(() => getProduct(slug!), [slug]);
  const [quantity, setQuantity] = useState(1);

  // 이 보유자의 다른 상품 (data 로드 후에만 호출)
  const related = useFetch<PageResponse<ProductSummary> | null>(
    () =>
      data?.artisan.slug
        ? getProducts({ artisan: data.artisan.slug, size: 4 })
        : Promise.resolve(null),
    [data?.artisan.slug],
  );

  if (loading) {
    return (
      <main>
        <Container className="grid gap-7 py-8 lg:grid-cols-2">
          <Skeleton className="aspect-[4/5] w-full" />
          <div className="flex flex-col gap-4">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full" />
          </div>
        </Container>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main>
        <Container className="py-9 text-center">
          <h1 className="font-display text-xl font-bold">상품 정보를 불러오지 못했습니다</h1>
          <p className="mt-3 text-sm text-text-muted">{error}</p>
          <Link to="/shop" className="mt-6 inline-block underline underline-offset-4">
            Shop으로 돌아가기
          </Link>
        </Container>
      </main>
    );
  }

  const soldOut = data.status === "SOLD_OUT";
  const inquiryOnly = data.status === "INQUIRY_ONLY";
  const others = (related.data?.content ?? []).filter((p) => p.slug !== data.slug).slice(0, 3);

  return (
    <main>
      {/* breadcrumb */}
      <Container className="pt-6">
        <p className="text-sm text-text-muted">
          <Link to="/shop" className="hover:underline underline-offset-4">
            Shop
          </Link>{" "}
          ›{" "}
          <span>
            {data.artisan.name} · {data.artisan.title}
          </span>{" "}
          › {data.name}
        </p>
      </Container>

      <section className="py-8 lg:py-9">
        <Container className="grid gap-7 lg:grid-cols-2">
          {/* 이미지 */}
          <div className="flex flex-col gap-4">
            {data.thumbnailUrl ? (
              <img
                src={data.thumbnailUrl}
                alt={`${data.artisan.name}의 ${data.name}`}
                className="aspect-[4/5] w-full rounded-md object-cover"
              />
            ) : (
              <EmptyBlock label="상품 이미지 준비 중" className="aspect-[4/5] w-full" />
            )}
            {data.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {data.images.map((img) => (
                  <img
                    key={img.sortOrder}
                    src={img.imageUrl}
                    alt={img.caption ?? data.name}
                    loading="lazy"
                    className="aspect-square w-full rounded-sm object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          {/* 정보 */}
          <div className="flex flex-col gap-5">
            <p className="flex items-center gap-2 text-sm text-text-muted">
              <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
              {PRODUCT_CATEGORY_LABEL[data.category]}
            </p>
            <h1 className="font-display text-2xl font-bold leading-tight tracking-[-0.02em]">
              {data.name}
            </h1>
            {inquiryOnly ? (
              <p className="text-md text-text-muted">가격은 문의를 통해 안내드립니다</p>
            ) : (
              <p className="font-display text-xl font-bold">{data.price.toLocaleString()}원</p>
            )}
            {data.summary && <p className="text-base text-text-muted">{data.summary}</p>}

            {/* 보유자 정보 — 상세는 새 도메인으로 재구축 예정, 현재는 비링크 */}
            <div className="flex items-center gap-3 rounded-md border border-border-base p-4">
              {data.artisan.profileImageUrl ? (
                <img
                  src={data.artisan.profileImageUrl}
                  alt={`${data.artisan.name} ${data.artisan.title}`}
                  className="h-12 w-12 rounded-pill object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-pill bg-surface-muted text-xs text-text-muted">
                  {data.artisan.name.slice(0, 1)}
                </span>
              )}
              <span className="flex flex-col">
                <span className="text-base font-bold">
                  {data.artisan.name}{" "}
                  <span className="font-medium text-text-muted">{data.artisan.title}</span>
                </span>
                <span className="text-sm text-text-muted">{data.artisan.shortIntro}</span>
              </span>
            </div>

            {/* 구매 / 문의 분기 */}
            {inquiryOnly ? (
              <Button variant="primary" onClick={() => navigate("/collaboration?type=COLLAB")}>
                작품 구매 문의하기
              </Button>
            ) : (
              <div className="flex flex-col gap-4">
                <label className="flex items-center gap-3 text-sm">
                  수량
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, data.stockQuantity)}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    disabled={soldOut}
                    className="min-h-[44px] w-24 rounded-sm border border-border-base bg-surface px-3"
                  />
                </label>
                <Button
                  variant="primary"
                  disabled={soldOut}
                  onClick={() =>
                    navigate("/order", {
                      // 장바구니는 메모리 상태로만 전달 (localStorage 금지 — claude.md)
                      state: {
                        items: [
                          {
                            productId: data.id,
                            slug: data.slug,
                            name: data.name,
                            price: data.price,
                            artisanName: data.artisan.name,
                            quantity,
                          },
                        ],
                      },
                    })
                  }
                >
                  {soldOut ? "품절된 상품입니다" : "주문하기"}
                </Button>
              </div>
            )}

            {data.externalUrl && (
              <a
                href={data.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-border-base px-6 py-3 text-base transition-colors duration-fast hover:border-text-primary"
              >
                외부 판매처에서 보기
              </a>
            )}
          </div>
        </Container>
      </section>

      {/* 상품 이야기 (마크다운) */}
      <section className="border-t border-border-base pb-8 pt-8 lg:pb-9">
        <Container>
          <p className="mb-3 flex items-center gap-2 text-sm text-text-muted">
            <span aria-hidden="true" className="h-2 w-2 rounded-pill bg-accent" />
            STORY
          </p>
          <h2 className="mb-6 font-display text-xl font-bold leading-tight">상품 이야기</h2>
          {data.description ? (
            <div className="max-w-2xl">
              <Markdown text={data.description} />
            </div>
          ) : (
            <EmptyBlock label="상세 설명 준비 중" className="h-40" />
          )}
        </Container>
      </section>

      {/* 이 보유자의 다른 상품 */}
      <section className="pb-8 lg:pb-9">
        <Container>
          <SectionHeading
            title={`${data.artisan.name}의 다른 상품`}
            to={`/shop?artisan=${data.artisan.slug}`}
            linkLabel="전체 보기"
          />
          {others.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {others.map((p) => (
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
            <EmptyBlock label="다른 상품 준비 중" className="h-40" />
          )}
        </Container>
      </section>
    </main>
  );
}
