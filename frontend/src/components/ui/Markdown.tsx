/**
 * story·description 마크다운 필드용 최소 렌더러.
 * 외부 라이브러리 없이 헤딩·문단·줄바꿈만 처리한다.
 *
 * 여기는 JSX로만 렌더한다 — React가 전부 이스케이프하므로 원문에 HTML이 섞여 있어도
 * 그대로 글자로 보인다. 이 성질이 사이트 전체의 XSS 방어선을 대신하고 있다.
 *
 * ⚠️ react-markdown 등으로 교체할 때 반드시 지킬 것:
 *   1. rehype-sanitize를 같이 넣는다. (raw HTML 허용 = rehype-raw 단독 사용 금지)
 *   2. dangerouslySetInnerHTML은 쓰지 않는다.
 *
 * 이유: 관리자 토큰이 localStorage에 있어서(api/client.ts) 이 렌더러에 스크립트가 한 번
 * 통과하면 토큰이 탈취되고, 그 토큰으로 admin 콘텐츠를 다시 심을 수 있다 — 한 번의 실수가
 * 지속적인 관리자 장악으로 이어진다. 토큰을 HttpOnly 쿠키로 옮기기 전까지는
 * 이 규칙이 그 대응책이다.
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
