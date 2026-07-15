import { Link } from "react-router-dom";
import CardImage from "./CardImage";
import type { ProductStatus } from "../../types/product";

interface Props {
  slug: string;
  name: string;
  price: number;
  status: ProductStatus;
  thumbnailUrl: string | null;
  artisanName: string;
}

/** ArtisanCard 규격 상속 + 가격·상태 배지 (design.md §3) */
export default function ProductCard({ slug, name, price, status, thumbnailUrl, artisanName }: Props) {
  return (
    <Link
      to={`/shop/${slug}`}
      className="group block overflow-hidden rounded-md bg-surface shadow-1 transition-shadow duration-fast hover:shadow-2 active:scale-[0.98]"
    >
      <CardImage src={thumbnailUrl} alt={`${artisanName}의 ${name}`} />
      <div className="flex flex-col gap-2 p-4">
        <span className="text-xs text-text-muted">{artisanName}</span>
        <span className="text-lg font-bold">{name}</span>
        <div className="flex items-center gap-2">
          {status === "INQUIRY_ONLY" ? (
            <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs">주문 문의</span>
          ) : (
            <span className="font-display text-base font-bold">{price.toLocaleString()}원</span>
          )}
          {status === "SOLD_OUT" && (
            <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs">품절</span>
          )}
        </div>
      </div>
    </Link>
  );
}
