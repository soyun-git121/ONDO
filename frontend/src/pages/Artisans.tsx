import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import wordmarkUrl from "../assets/ondo-wordmark-lg.svg";
import { getArtisans } from "../api/artisans";
import { useFetch } from "../hooks/useFetch";
import { DESIGNATION_LABEL } from "../types/artisan";
import { resolveImageUrl } from "../api/client";

/**
 * 보유자(Holder) — Figma 57:2 "보유자 목록 / Desktop / Wireframe (yungbld×blit)" 픽셀 정합 이식.
 * 시그니처 구성: 대형 ONDO 워드마크 위에 프로필 카드가 겹쳐 "ON [카드] DO"를 이루고,
 * 뒤로 회색 데코 카드가 겹쳐 있음.
 *
 * 이 중앙 컴포지션(ONDO 글자 + 카드 + 데코)은 어떤 폭에서도 구조가 깨지지 않도록
 * 고정 1440×940 캔버스로 만들고 scale-to-fit(비율 축소)만 적용 — 내부 레이아웃은 항상 동일.
 * Header/Footer/BackgroundPattern은 공통(Layout). 좌표=Figma 절대값(상단 오프셋 179).
 *
 * 데이터: GET /api/artisans. 한 번에 한 명씩 카드에 띄우고 우측 점으로 전환한다.
 * 점 개수 = 실제 보유자 수(와이어프레임의 3개 고정이 아님).
 * 백엔드 미기동·자료 없음이면 와이어프레임 플레이스홀더를 그대로 유지한다(useFetch 규약).
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";
const CANVAS_W = 1440;
const CANVAS_H = 940;

/** 프로필 카드 내부 사진 영역 — 카드(440,51,560×720) 상단, 이름 텍스트(619) 위까지. */
const PHOTO = { l: 440, t: 51, w: 560, h: 549 };

/** 절대 배치 텍스트 헬퍼 (캔버스 내부 좌표) */
function A({ l, t, w, cls = "", children }: { l: number; t: number; w?: number; cls?: string; children: ReactNode }) {
  return (
    <p className={`absolute ${cls}`} style={{ left: l, top: t, width: w }}>
      {children}
    </p>
  );
}

export default function Artisans() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [idx, setIdx] = useState(0);

  const { data, loading } = useFetch(() => getArtisans({ size: 20 }), []);
  const artisans = data?.content ?? [];
  // 데이터가 줄어드는 경우(재조회)에도 인덱스가 범위를 벗어나지 않도록 방어.
  const current = artisans[Math.min(idx, artisans.length - 1)];

  /** 점 개수 — 자료가 없을 땐 와이어프레임 톤 유지를 위해 3개를 그린다. */
  const dotCount = artisans.length || 3;

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / CANVAS_W));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <main>
      <div className="px-4 py-16 sm:px-6">
        {/* scale-to-fit 래퍼: max-w-1440, 폭에 맞춰 캔버스가 정확히 채워짐 → 구조 불변 */}
        <div
          ref={wrapRef}
          className="relative mx-auto w-full max-w-[1440px] overflow-hidden"
          style={{ height: CANVAS_H * scale }}
        >
          <div
            className="absolute left-0 top-0"
            style={{
              width: CANVAS_W,
              height: CANVAS_H,
              transformOrigin: "top left",
              transform: `scale(${scale})`,
              fontFamily: INTER,
            }}
          >
            {/* ── 데코 카드 (뒤) — 57:6/7/8 ── */}
            <div className="absolute rounded-[18px] bg-[#dbdbdb]" style={{ left: 476, top: 20, width: 480, height: 140 }} />
            <div className="absolute rounded-[18px] bg-[#e6e6e6]" style={{ left: 496, top: 0, width: 440, height: 140 }} />
            <div className="absolute rounded-[18px] bg-[#e0e0e0]" style={{ left: 486, top: 790, width: 460, height: 150 }} />

            {/* ── 대형 ONDO 워드마크 (뒤) — 265:757, 1252×368 ── */}
            <img
              src={wordmarkUrl}
              alt="ONDO"
              className="absolute block"
              style={{ left: 80, top: 227, width: 1252, height: 368 }}
            />

            {/* ── 프로필 카드 (앞) — 58:2, 560×720 ── */}
            <div
              className="absolute rounded-[22px] border border-[#d9d9d9] bg-[#e9e9e9]"
              style={{ left: 440, top: 51, width: 560, height: 720 }}
            />
            {current?.profileImageUrl ? (
              <img
                src={resolveImageUrl(current.profileImageUrl)}
                alt={`${current.name} 보유자 프로필 사진`}
                className="absolute rounded-t-[22px] object-cover"
                style={{ left: PHOTO.l, top: PHOTO.t, width: PHOTO.w, height: PHOTO.h }}
              />
            ) : (
              <A l={440} t={121} w={560} cls="text-center text-[14px] text-[#999]">
                {loading ? "불러오는 중…" : "보유자 프로필 사진 — 준비 중"}
              </A>
            )}

            <A l={440} t={619} w={560} cls="text-center text-[30px] font-bold text-text-primary">
              {current?.name ?? (loading ? "" : "보유자 준비 중")}
            </A>
            <A l={440} t={663} w={560} cls="text-center text-[14px] text-text-muted">
              {current ? `${current.title} · ${DESIGNATION_LABEL[current.designation]}` : ""}
            </A>

            {/* 카드 전체를 상세 랜딩(/artisans/:slug)으로 연결 — 자료 있을 때만 */}
            {current && (
              <Link
                to={`/artisans/${current.slug}`}
                aria-label={`${current.name} 보유자 상세 보기`}
                className="absolute rounded-[22px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                style={{ left: 440, top: 51, width: 560, height: 720 }}
              />
            )}

            {/* ── 페이지네이션 — 247:397, 9×56. 점 개수 = 실제 보유자 수 ── */}
            <div
              className="absolute flex flex-col items-center justify-between"
              style={{ left: 1356, top: 377, width: 9, height: 56 }}
            >
              {Array.from({ length: dotCount }, (_, i) => {
                const active = i === Math.min(idx, artisans.length - 1);
                const dotCls = `h-[7px] w-[7px] rounded-full ${active ? "bg-accent" : "bg-[#d9d9d9]"}`;
                // 자료가 없으면 누를 대상이 없으므로 장식용 점으로만 그린다.
                if (!artisans.length) return <span key={i} className={dotCls} />;
                return (
                  <button
                    key={artisans[i].slug}
                    type="button"
                    onClick={() => setIdx(i)}
                    aria-label={`${artisans[i].name} 보기`}
                    aria-current={active}
                    className={dotCls}
                  />
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
