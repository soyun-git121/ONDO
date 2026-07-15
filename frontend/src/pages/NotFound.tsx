import { Link } from "react-router-dom";
import Container from "../components/layout/Container";

export default function NotFound() {
  return (
    <main>
      <Container className="flex flex-col items-center gap-6 py-9 text-center">
        <h1 className="font-display text-display font-bold leading-none tracking-tight">404</h1>
        <p className="text-md text-text-muted">찾으시는 페이지가 없습니다.</p>
        <Link
          to="/"
          className="inline-flex min-h-[44px] items-center rounded-pill bg-primary px-6 py-3 text-base font-medium text-text-primary transition-all duration-fast hover:brightness-[0.94]"
        >
          홈으로 돌아가기
        </Link>
      </Container>
    </main>
  );
}
