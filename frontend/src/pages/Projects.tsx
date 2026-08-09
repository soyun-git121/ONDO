import { useState } from "react";
import { Link } from "react-router-dom";
import { getProjects } from "../api/projects";
import { useFetch } from "../hooks/useFetch";
import { PROJECT_TYPE_LABEL, type ProjectSummary } from "../types/project";
import { resolveImageUrl } from "../api/client";

/**
 * Project — Shop/About 와이어프레임과 동일한 디자인 언어로 신규 생성.
 * (Figma에 Project 전용 프레임은 없어, Collaboration 55:2 "Proof / cases"의
 *  Card/case 디자인을 참고해 프로젝트(협업 실적) 카드로 구성.)
 *
 * 구성: 대형 헤딩(Inter Bold 150px) + 협업 실적 카드 그리드.
 * 카드(Figma 55:51~59): image 400×240 rounded-4 · 태그 pill(#fefefe/border) ·
 *   title Inter Bold 18 · client #999 13 · metric chip(brand-secondary).
 * Header/Footer/BackgroundPattern은 공통(Layout).
 *
 * 데이터: GET /api/projects — admin에서 '공개'로 등록한 실적이 projectDate DESC로 내려온다.
 * 백엔드 미기동·자료 없음이면 안내 문구만 띄운다(useFetch 규약).
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

const PAGE_SIZE = 12;
/** 백엔드 ProjectService.MAX_SIZE와 같은 값. 넘겨도 잘리므로 더보기를 여기서 멈춘다. */
const MAX_SIZE = 50;

function ProjectCard({ p }: { p: ProjectSummary }) {
  return (
    <Link to={`/projects/${p.slug}`} className="group block">
      {/* image — figma 55:51 : 400×240 rounded-[4px] surface-muted */}
      {p.thumbnailUrl ? (
        <img
          src={resolveImageUrl(p.thumbnailUrl)}
          alt=""
          loading="lazy"
          decoding="async"
          className="aspect-[400/240] w-full rounded-[4px] bg-surface-muted object-cover"
        />
      ) : (
        <div className="aspect-[400/240] w-full rounded-[4px] bg-surface-muted" />
      )}
      {/* tag pill — figma 55:53 : #fefefe + border-base, rounded-[12px], 12px */}
      <span className="mt-4 inline-flex h-[24px] items-center rounded-[12px] border border-border-base bg-[#fefefe] px-[8px] text-[12px] text-text-primary">
        {PROJECT_TYPE_LABEL[p.type]}
      </span>
      {/* title — figma 55:55 : Inter Bold 18 */}
      <p className="mt-3 text-[18px] font-bold text-text-primary group-hover:underline">
        {p.title}
      </p>
      {/* client — figma 55:56 : #999 13. 비공개 협업사는 admin에서 비워 두므로 그때는 줄을 뺀다. */}
      {p.clientName && <p className="mt-2 text-[13px] text-[#999]">{p.clientName}</p>}
      {/* metric chip — design.md §3 : resultMetric은 brand-secondary로 강조 */}
      {p.resultMetric && (
        <span className="mt-3 inline-flex h-[26px] items-center bg-secondary px-[8px] text-[14px] font-medium text-text-primary">
          {p.resultMetric}
        </span>
      )}
    </Link>
  );
}

export default function Projects() {
  const [size, setSize] = useState(PAGE_SIZE);

  const { data, loading, error } = useFetch(() => getProjects({ size }), [size]);
  const items = data?.content ?? [];
  // size를 늘려도 백엔드가 MAX_SIZE에서 자르므로, 그 지점에선 더보기를 감춘다.
  const hasNext = (data?.hasNext ?? false) && size < MAX_SIZE;

  const emptyText = loading
    ? "불러오는 중…"
    : error
      ? "실적을 불러오지 못했습니다."
      : "등록된 협업 실적이 없습니다.";

  return (
    <main style={{ fontFamily: INTER }}>
      <div className="mx-auto max-w-[1280px] px-4 pb-16 pt-8 sm:px-6 lg:px-5 lg:pt-[30px]">
        {/* 대형 헤딩 — Shop/About와 동일: Inter Bold 150px */}
        <h1 className="whitespace-nowrap text-[clamp(56px,15vw,150px)] font-bold leading-none text-text-primary">
          Project
        </h1>
        {/* 서브타이틀 — figma 55:49 "온도가 만들어온 협업" 참고 */}
        <p className="mt-4 max-w-[560px] text-[15px] leading-[1.6] text-text-muted">
          온도가 보유자와 함께 만들어온 협업의 기록입니다.
        </p>

        {/* 협업 실적 카드 그리드 (40px 간격, 3열) */}
        {items.length === 0 ? (
          <p className="mt-10 text-[15px] text-text-muted">{emptyText}</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-x-[40px] gap-y-[60px] sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {items.map((p) => (
              <ProjectCard key={p.slug} p={p} />
            ))}
          </div>
        )}

        {hasNext && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              onClick={() => setSize(size + PAGE_SIZE)}
              disabled={loading}
              className="flex h-[52px] w-[200px] items-center justify-center rounded-[26px] border border-border-base bg-[#fefefe] text-[15px] font-medium text-text-primary disabled:opacity-50"
            >
              {loading ? "불러오는 중…" : "실적 더 보기"}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
