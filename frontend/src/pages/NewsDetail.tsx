import { Link, useParams } from "react-router-dom";
import { getNews } from "../api/news";
import { useFetch } from "../hooks/useFetch";
import Container from "../components/layout/Container";
import Skeleton from "../components/ui/Skeleton";
import Markdown from "../components/ui/Markdown";
import { NEWS_CATEGORY_LABEL } from "../types/news";

/** 뉴스 상세 — ORIGINAL 전용 (CURATED는 목록에서 외부 링크로 이동) */
export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetch(() => getNews(Number(id)), [id]);

  if (loading) {
    return (
      <main>
        <Container className="max-w-2xl py-8">
          <Skeleton className="h-8 w-72" />
          <Skeleton className="mt-4 h-4 w-40" />
          <Skeleton className="mt-8 h-64 w-full" />
        </Container>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main>
        <Container className="py-9 text-center">
          <h1 className="font-display text-xl font-bold">소식을 불러오지 못했습니다</h1>
          <p className="mt-3 text-sm text-text-muted">{error}</p>
          <Link to="/news" className="mt-6 inline-block underline underline-offset-4">
            News로 돌아가기
          </Link>
        </Container>
      </main>
    );
  }

  return (
    <main>
      <article>
        <Container className="max-w-2xl py-8 lg:py-9">
          <span className="rounded-pill bg-surface-muted px-3 py-1 text-xs">
            {NEWS_CATEGORY_LABEL[data.category]}
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold leading-tight tracking-[-0.02em]">
            {data.title}
          </h1>
          <p className="mt-3 text-xs text-text-muted">
            {new Date(data.publishedAt).toLocaleDateString("ko-KR")}
            {data.artisan && (
              <>
                {" · "}
                <Link to={`/artisans/${data.artisan.slug}`} className="underline underline-offset-4">
                  {data.artisan.name}
                </Link>
              </>
            )}
          </p>

          {data.thumbnailUrl && (
            <img src={data.thumbnailUrl} alt="" className="mt-7 w-full rounded-md object-cover" />
          )}

          <div className="mt-7">
            <Markdown text={data.content} />
          </div>
        </Container>
      </article>
    </main>
  );
}
