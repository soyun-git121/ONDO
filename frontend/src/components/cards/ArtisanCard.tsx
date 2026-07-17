import type { ArtisanSummary } from "../../types/artisan";
import CardImage from "./CardImage";

/**
 * design.md §3 ArtisanCard — yungbld 스타일.
 * 보유자 상세는 새 도메인으로 재구축 예정 → 현재는 비링크 정적 카드.
 */
export default function ArtisanCard({ artisan }: { artisan: ArtisanSummary }) {
  return (
    <article className="block overflow-hidden rounded-md bg-surface shadow-1">
      <CardImage src={artisan.profileImageUrl} alt={`${artisan.name} ${artisan.title} 작업 모습`} />
      <div className="flex flex-col gap-2 p-4">
        <span className="w-fit rounded-pill bg-surface-muted px-3 py-1 text-xs">{artisan.title}</span>
        <span className="text-lg font-bold">{artisan.name}</span>
        <span className="truncate text-sm text-text-muted">{artisan.shortIntro}</span>
      </div>
    </article>
  );
}
