/**
 * 자료(이미지·콘텐츠·데이터)가 아직 없는 자리를 표시하는 빈칸 플레이스홀더.
 * 실제 자료가 admin에 등록되면 해당 컴포넌트로 교체된다.
 */
export default function EmptyBlock({
  label = "자료 준비 중",
  className = "",
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-md bg-surface-muted ${className}`}
    >
      {label && <span className="text-sm text-text-muted">{label}</span>}
    </div>
  );
}
