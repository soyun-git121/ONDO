import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { getArtisans } from "../api/artisans";
import type { ArtisanSummary } from "../types/artisan";
import Container from "../components/layout/Container";
import Button from "../components/ui/Button";

/**
 * 보유자 목록 — 피그마 57:2 반영 (yungbld 중앙 카드 덱).
 * 대형 "ONDO" 타이포 뒤, 중앙 프로필 카드 덱을 순환 탐색.
 * 스크롤 하이재킹 금지(design.md) → 버튼 + 키보드(↑/↓)로만 이동.
 * 접근성: aria-live 안내 · sr-only 전체 링크 목록 · hasNext 시 "더 불러오기".
 */
export default function Artisans() {
  const [items, setItems] = useState<ArtisanSummary[]>([]);
  const [page, setPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);
  const [announce, setAnnounce] = useState("");
  const inFlight = useRef(false);

  const loadPage = useCallback(async (nextPage: number) => {
    if (inFlight.current) return;
    inFlight.current = true;
    setLoading(true);
    setError(null);
    try {
      const res = await getArtisans({ page: nextPage, size: 12 });
      setItems((prev) => (nextPage === 0 ? res.content : [...prev, ...res.content]));
      setHasNext(res.hasNext);
      setPage(nextPage);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      inFlight.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  const len = items.length;
  const current = len > 0 ? items[Math.min(active, len - 1)] : undefined;

  // 현재 보유자 안내 (스크린리더)
  useEffect(() => {
    if (current) setAnnounce(`${current.name} ${current.title}, ${Math.min(active, len - 1) + 1} / ${len}`);
  }, [active, current, len]);

  const go = useCallback(
    (delta: number) => {
      if (len === 0) return;
      const n = active + delta;
      if (n < 0) {
        setActive(len - 1);
      } else if (n >= len) {
        if (hasNext) {
          loadPage(page + 1);
          setActive(n); // 로드 완료 후 유효해짐
        } else {
          setActive(0); // 무한 순환
        }
      } else {
        setActive(n);
      }
    },
    [active, len, hasNext, page, loadPage],
  );

  function onKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "ArrowDown" || e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  }

  const idx = Math.min(active, Math.max(0, len - 1));
  const prev = len > 1 ? items[(idx - 1 + len) % len] : undefined;
  const next = len > 1 ? items[(idx + 1) % len] : undefined;

  return (
    <main>
      <Container className="pt-6">
        <h1 className="sr-only">보유자</h1>
        <p className="text-sm text-text-muted">/artisans — 온도와 함께하는 무형문화재 보유자</p>
      </Container>

      {/* ── 덱 캔버스 ── */}
      <div
        role="region"
        aria-roledescription="캐러셀"
        aria-label="보유자 둘러보기 (위/아래 화살표로 이동)"
        tabIndex={0}
        onKeyDown={onKey}
        className="relative flex min-h-[72vh] items-center justify-center overflow-hidden px-3 py-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text-primary"
      >
        {/* 대형 배경 타이포 ON / DO */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2 top-1/2 -translate-y-1/2 select-none font-display text-display font-bold leading-none tracking-[-0.03em] lg:left-8"
        >
          ON
        </span>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 select-none font-display text-display font-bold leading-none tracking-[-0.03em] lg:right-8"
        >
          DO
        </span>

        {/* 덱 */}
        {current ? (
          <div className="relative z-10 h-[520px] w-[340px]">
            {/* 뒤 카드 (위/아래 피크) */}
            {prev && (
              <div
                aria-hidden="true"
                className="absolute inset-x-4 top-0 h-full -translate-y-9 scale-95 rounded-md bg-surface-muted opacity-60 shadow-1"
              />
            )}
            {next && (
              <div
                aria-hidden="true"
                className="absolute inset-x-4 top-0 h-full translate-y-9 scale-95 rounded-md bg-surface-muted opacity-60 shadow-1"
              />
            )}

            {/* 앞 카드 — 상세는 새 도메인으로 재구축 예정, 현재는 비링크 */}
            <div className="absolute inset-0 z-10 flex flex-col overflow-hidden rounded-md bg-surface-muted shadow-2">
              {current.profileImageUrl ? (
                <img
                  src={current.profileImageUrl}
                  alt={`${current.name} ${current.title} 작업 모습`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-sm text-text-muted">
                  보유자 프로필 사진 — 준비 중
                </span>
              )}
              <span className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 bg-bg-base/90 p-4 text-center backdrop-blur">
                <span className="font-display text-lg font-bold">{current.name}</span>
                <span className="text-sm text-text-muted">{current.title}</span>
              </span>
            </div>
          </div>
        ) : (
          <div className="z-10 flex h-[520px] w-[340px] items-center justify-center rounded-md bg-surface-muted text-sm text-text-muted">
            {loading ? "불러오는 중…" : "준비 중인 보유자가 있습니다"}
          </div>
        )}

        {/* 이전/다음 버튼 */}
        {len > 1 && (
          <div className="absolute right-3 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2 lg:right-16">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="이전 보유자"
              className="flex h-11 w-11 items-center justify-center rounded-pill border border-border-base bg-surface transition-colors duration-fast hover:border-text-primary"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="다음 보유자"
              className="flex h-11 w-11 items-center justify-center rounded-pill border border-border-base bg-surface transition-colors duration-fast hover:border-text-primary"
            >
              ↓
            </button>
          </div>
        )}
      </div>

      {/* 하단: 상태 · 접근성 폴백 · 안내 */}
      <Container className="pb-8 text-center lg:pb-9">
        {error ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-error">목록을 불러오지 못했습니다. ({error})</p>
            <Button variant="secondary" onClick={() => loadPage(len === 0 ? 0 : page + 1)}>
              다시 불러오기
            </Button>
          </div>
        ) : len === 0 && !loading ? (
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm underline underline-offset-4"
          >
            인스타그램에서 소식 받기
          </a>
        ) : (
          <>
            <p className="text-xs text-text-muted">
              위/아래 화살표(또는 ↑ ↓ 버튼)로 보유자를 넘겨보세요
            </p>
            {hasNext && (
              <div className="mt-4">
                <Button variant="secondary" loading={loading} onClick={() => loadPage(page + 1)}>
                  보유자 더 불러오기
                </Button>
              </div>
            )}
          </>
        )}

        {/* 스크린리더/키보드용 전체 목록 폴백 */}
        {len > 0 && (
          <nav aria-label="보유자 전체 목록" className="sr-only">
            <ul>
              {items.map((a) => (
                <li key={a.slug}>
                  {a.name} {a.title} — {a.shortIntro}
                </li>
              ))}
            </ul>
          </nav>
        )}

        <p aria-live="polite" className="sr-only">
          {announce}
        </p>
      </Container>
    </main>
  );
}
