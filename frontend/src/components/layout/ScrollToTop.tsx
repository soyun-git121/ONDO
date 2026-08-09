import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * 라우트가 바뀌면 페이지 맨 위로 올린다.
 *
 * React Router는 화면만 갈아끼우고 스크롤은 그대로 두기 때문에, 푸터(=페이지 최하단)의
 * 메뉴를 누르면 새 페이지가 중간부터 보인다. 특히 홈·협업문의처럼 긴 페이지에서 티가 난다.
 *
 * 단, 뒤로/앞으로 가기(POP)는 건드리지 않는다 — 사용자는 보던 위치로 돌아가길 기대한다.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (navigationType === "POP") return;
    window.scrollTo(0, 0);
  }, [pathname, navigationType]);

  return null;
}
