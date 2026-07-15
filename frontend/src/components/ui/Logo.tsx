import logoUrl from "../../assets/logo.svg";

/**
 * ONDO 로고. 실제 로고 파일을 src/assets/logo.svg로 교체하면 전체 반영된다.
 * (현재 파일은 임시 워드마크 플레이스홀더 — 피그마에 있는 로고 원본으로 교체 필요)
 */
export default function Logo({ className = "h-6" }: { className?: string }) {
  return <img src={logoUrl} alt="ONDO" className={className} />;
}
