import { Link } from "react-router-dom";
import type { ArtisanSummary } from "../../types/artisan";
import CardImage from "./CardImage";

/**
 * design.md §3 ArtisanCard — yungbld 스타일.
 * 카드 전체가 하나의 링크(내부 링크 중첩 금지).
 */
export default function ArtisanCard({ artisan }: { artisan: ArtisanSummary }) {
  return (
    <Link
      to={`/artisans/${artisan.slug}`}
      className="group block overflow-hidden rounded-md bg-surface shadow-1 transition-shadow duration-fast hover:shadow-2 active:scale-[0.98]"
    >
      <CardImage src={artisan.profileImageUrl} alt={`${artisan.name} ${artisan.title} 작업 모습`} />
      <div className="flex flex-col gap-2 p-4">
        <span className="w-fit rounded-pill bg-surface-muted px-3 py-1 text-xs">{artisan.title}</span>
        <span className="text-lg font-bold">{artisan.name}</span>
        <span className="truncate text-sm text-text-muted">{artisan.shortIntro}</span>
      </div>
    </Link>
  );
}
