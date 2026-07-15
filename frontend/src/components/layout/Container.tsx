import type { ReactNode } from "react";

/** design.md Layout Foundations — max-width 1280, 좌우 패딩 space-5(모바일 space-3) */
export default function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[1280px] px-3 lg:px-5 ${className}`}>{children}</div>;
}
