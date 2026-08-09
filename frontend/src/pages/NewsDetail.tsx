import { Link, useParams } from "react-router-dom";
import { getNews } from "../api/news";
import { useFetch } from "../hooks/useFetch";
import { NEWS_CATEGORY_LABEL } from "../types/news";
import { resolveImageUrl } from "../api/client";
import Container from "../components/layout/Container";
import Markdown from "../components/ui/Markdown";
import Skeleton from "../components/ui/Skeleton";

/**
 * News · Detail — Figma 53:62 "News · Detail / Desktop / Wireframe (blit)".
 * Header/Footer/BackgroundPattern은 공통(Layout). 760px 중앙 정렬 아티클.
 * 구성: 목록 링크 + 카테고리 pill + 제목(44) + 메타 + 대표 이미지 + 본문(마크다운) + 하단 링크.
 *
 * 데이터: GET /api/news/{id}. ORIGINAL(자체 작성) 기사만 상세가 있다 —
 *   CURATED(네이버 임포트)는 목록에서 원문으로 바로 나가므로 여기로 오지 않는다(NewsLink 규칙).
 *
 * 시안은 절대좌표 캔버스였지만 본문 길이가 기사마다 다르다. 고정 높이 캔버스에서는
 * 본문이 길면 잘리고 짧으면 빈 공간이 남으므로, 같은 치수(760 폭·44 제목·420 이미지)를
 * 유지한 세로 흐름 배치로 옮겼다.
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

export default function NewsDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error } = useFetch(() => getNews(Number(id)), [id]);

  if (loading) {
    return (
      <main>
        <Container className="max-w-[760px] py-8">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="mt-6 h-10 w-full" />
          <Skeleton className="mt-4 h-4 w-52" />
          <Skeleton className="mt-6 aspect-[760/420] w-full" />
        </Container>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main>
        <Container className="max-w-[760px] py-9 text-center">
          <h1 className="text-[22px] font-bold text-text-primary">뉴스를 불러오지 못했습니다</h1>
          <p className="mt-3 text-[14px] text-text-muted">{error}</p>
          <Link to="/news" className="mt-6 inline-block text-[14px] underline underline-offset-4">
            News 목록으로 돌아가기
          </Link>
        </Container>
      </main>
    );
  }

  const meta = [
    new Date(data.publishedAt).toLocaleDateString("ko-KR"),
    // 보유자 상세 라우트가 아직 없어 링크하지 않고 이름만 적는다.
    data.artisan?.name,
  ]
    .filter(Boolean)
    .join("      ·      ");

  return (
    <main style={{ fontFamily: INTER }}>
      <div className="mx-auto max-w-[760px] px-4 pb-12 pt-6 sm:px-6">
        <Link to="/news" className="whitespace-pre text-[14px] text-text-muted underline-offset-4 hover:underline">
          {"‹  News 목록"}
        </Link>

        <p className="mt-6">
          <span className="inline-flex h-[24px] items-center rounded-[12px] border border-border-base bg-[#fefefe] px-[10px] text-[12px] text-text-primary">
            {NEWS_CATEGORY_LABEL[data.category]}
          </span>
        </p>

        <h1 className="mt-4 text-[clamp(30px,8vw,44px)] font-bold leading-[normal] text-text-primary">
          {data.title}
        </h1>
        <p className="mt-4 whitespace-pre-wrap text-[15px] leading-[1.6] text-text-muted">{meta}</p>

        {/* 대표 이미지 — 없으면 와이어프레임 톤의 회색 자리 유지 */}
        {data.thumbnailUrl ? (
          <img
            src={resolveImageUrl(data.thumbnailUrl)}
            alt=""
            className="mt-6 aspect-[760/420] w-full rounded-[4px] bg-surface-muted object-cover"
          />
        ) : (
          <div className="mt-6 flex aspect-[760/420] w-full items-center justify-center rounded-[4px] bg-surface-muted">
            <span className="text-[14px] text-[#999]">대표 이미지 — 준비 중</span>
          </div>
        )}

        <article className="mt-8 text-text-primary">
          {data.content?.trim() ? (
            <Markdown text={data.content} />
          ) : (
            <p className="text-[14px] text-[#999]">본문이 아직 등록되지 않았습니다.</p>
          )}
        </article>

        <p className="mt-10 text-center">
          <Link to="/news" className="text-[14px] text-text-primary underline-offset-4 hover:underline">
            {"‹  News 목록으로 돌아가기"}
          </Link>
        </p>
      </div>
    </main>
  );
}
