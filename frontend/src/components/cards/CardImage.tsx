import { useState } from "react";

/**
 * 카드 커버 이미지 공통 — 4:5 비율 고정(CLS 방지), lazy loading.
 * 이미지 없거나 로드 실패 시 빈칸 플레이스홀더(자료 준비 중) 표시.
 */
export default function CardImage({
  src,
  alt,
}: {
  src: string | null | undefined;
  alt: string;
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className="flex aspect-[4/5] w-full items-center justify-center bg-surface-muted"
        role="img"
        aria-label={alt}
      >
        <span className="text-xs text-text-muted">이미지 준비 중</span>
      </div>
    );
  }
  return (
    <div className="aspect-[4/5] w-full overflow-hidden bg-surface-muted">
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover transition-transform duration-fast group-hover:scale-[1.03]"
      />
    </div>
  );
}
