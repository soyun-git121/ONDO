/**
 * story·description 마크다운 필드용 최소 렌더러.
 * 외부 라이브러리 없이 헤딩·문단·줄바꿈만 처리한다 (Phase 2에서 react-markdown 교체 검토).
 */
export default function Markdown({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <div className="flex flex-col gap-4 leading-relaxed">
      {blocks.map((block, i) => {
        const heading = block.match(/^(#{1,3})\s+(.*)$/);
        if (heading) {
          const level = heading[1].length;
          const cls =
            level === 1
              ? "text-2xl font-bold leading-tight tracking-tight font-display"
              : level === 2
                ? "text-xl font-bold leading-tight"
                : "text-lg font-bold";
          return (
            <p key={i} role="heading" aria-level={level + 1} className={cls}>
              {heading[2]}
            </p>
          );
        }
        return (
          <p key={i} className="whitespace-pre-line text-base">
            {block}
          </p>
        );
      })}
    </div>
  );
}
