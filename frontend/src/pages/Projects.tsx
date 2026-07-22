/**
 * Project — Shop/About 와이어프레임과 동일한 디자인 언어로 신규 생성.
 * (Figma에 Project 전용 프레임은 없어, Collaboration 55:2 "Proof / cases"의
 *  Card/case 디자인을 참고해 프로젝트(협업 실적) 카드로 구성.)
 *
 * 구성: 대형 헤딩(Inter Bold 150px) + 협업 실적 카드 그리드.
 * 카드(Figma 55:51~59): image 400×240 rounded-4 · 태그 pill(#fefefe/border) ·
 *   title Inter Bold 18 · client #999 13 · metric chip(대표는 brand-secondary, 그 외 muted).
 * Header/Footer/BackgroundPattern은 공통(Layout).
 */

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

interface Project {
  tag: string;
  title: string;
  client: string;
  metric: string;
  highlight?: boolean;
}

const PROJECTS: Project[] = [
  { tag: "펀딩", title: "장도 텀블벅 펀딩", client: "텀블벅", metric: "펀딩률 9,800% 달성", highlight: true },
  { tag: "기업 선물", title: "[협업 실적]", client: "[클라이언트]", metric: "[성과 지표]" },
  { tag: "콜라보", title: "[협업 실적]", client: "[클라이언트]", metric: "[성과 지표]" },
  { tag: "협업", title: "[협업 실적]", client: "[클라이언트]", metric: "[성과 지표]" },
  { tag: "굿즈", title: "[협업 실적]", client: "[클라이언트]", metric: "[성과 지표]" },
  { tag: "전시", title: "[협업 실적]", client: "[클라이언트]", metric: "[성과 지표]" },
];

function ProjectCard({ p }: { p: Project }) {
  return (
    <div>
      {/* image — figma 55:51 : 400×240 rounded-[4px] surface-muted */}
      <div className="aspect-[400/240] w-full rounded-[4px] bg-surface-muted" />
      {/* tag pill — figma 55:53 : #fefefe + border-base, rounded-[12px], 12px */}
      <span className="mt-4 inline-flex h-[24px] items-center rounded-[12px] border border-border-base bg-[#fefefe] px-[8px] text-[12px] text-text-primary">
        {p.tag}
      </span>
      {/* title — figma 55:55 : Inter Bold 18 */}
      <p className="mt-3 text-[18px] font-bold text-text-primary">{p.title}</p>
      {/* client — figma 55:56 : #999 13 */}
      <p className="mt-2 text-[13px] text-[#999]">{p.client}</p>
      {/* metric chip — figma 55:58/59 : 대표는 brand-secondary+black, 그 외 muted+#999 */}
      <span
        className={`mt-3 inline-flex h-[26px] items-center px-[8px] text-[14px] font-medium ${
          p.highlight ? "bg-secondary text-text-primary" : "bg-surface-muted text-[#999]"
        }`}
      >
        {p.metric}
      </span>
    </div>
  );
}

export default function Projects() {
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
        <div className="mt-10 grid grid-cols-1 gap-x-[40px] gap-y-[60px] sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={i} p={p} />
          ))}
        </div>
      </div>
    </main>
  );
}
