/**
 * About — Figma 41:2 "About / Desktop / Wireframe (blit)" 픽셀 정합 이식.
 * Header/Footer/BackgroundPattern은 공통(Layout). 본문 = Hero + 3섹션(Mission/Vision/Core Value).
 * 본문 카피 정본은 SECTIONS/CORE_VALUES 한 곳 — 데스크톱(절대좌표)·모바일(스택) 양쪽이 같은 값을 참조.
 * 타이포는 Figma 그대로 Inter(한글은 Pretendard 폴백), 색은 토큰과 1:1(#f2f2f2/#e5e5e5/#666).
 *
 * ≥1280: Figma 1440 콘텐츠존(x80~1360)을 max-w-[1280px] 캔버스에 절대좌표로 재현.
 *        좌표 = (figmaX-80, figmaY-120). <1280: 세로 스택으로 반응형.
 */

import missionImg from "../assets/about-mission.png";
import visionImg from "../assets/about-vision.jpg";
import coreValueImg from "../assets/about-core-value.png";
import FitCanvas from "../components/ui/FitCanvas";

const INTER = "'Inter', 'Pretendard Variable', sans-serif";

/**
 * 본문 타이포 정본 — 데스크톱·모바일 공통.
 * Figma 원안은 15px였으나 국문 가독성이 떨어져 18px/1.7로 상향(레이아웃 좌표는 그대로).
 * 크기를 조정할 땐 이 상수만 고치면 3곳(데스크톱 Mission·Vision, 모바일 스택)에 전파된다.
 */
const BODY_TYPE = "text-[18px] leading-[1.7] text-text-muted";

/** Core Value 4축 — ko는 국문 정본, en은 병기 영문(없으면 생략) */
const CORE_VALUES = [
  { ko: "지속성", en: "Sustainability" },
  { ko: "진정성", en: "Authenticity" },
  { ko: "세계성", en: "Globality" },
  { ko: "혁신성", en: "Innovation" },
];

const SECTIONS: {
  n: string;
  title: string;
  body?: string;
  values?: typeof CORE_VALUES;
  src: string;
  alt: string;
}[] = [
  {
    n: "01",
    title: "Mission",
    body: "우리는 전통 장인을 시장과 연결해, 창작에만 집중할 수 있게 한다.",
    src: missionImg,
    alt: "흰 모시 한복을 입은 장인이 손으로 가는 실을 한 올씩 고르는 모습",
  },
  {
    n: "02",
    title: "Vision",
    body: "전통기술이 세대와 국경을 넘어 지속되는 생태계를 만든다.",
    src: visionImg,
    alt: "빛의 네트워크로 연결된 밤의 지구",
  },
  {
    n: "03",
    title: "Core Value",
    values: CORE_VALUES,
    src: coreValueImg,
    alt: "두 사람이 마주 서서 악수하는 모습",
  },
];

/** ● 라임 뱃지 도트 (figma badge/dot, 10×10) */
function Dot({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`block size-[10px] rounded-full bg-accent ${className}`} />;
}

/**
 * 섹션 이미지 — 기존 회색 홀더(600×340)와 정확히 같은 박스를 차지한다.
 * 원본 3장 모두 홀더보다 세로가 길어 object-cover로 상하를 잘라 채운다.
 *
 * 크기 클래스(h-/w-/aspect-)는 절대 여기 두지 말 것 — 호출부가 넘기는 값과
 * 같은 특이도라 Tailwind 생성 순서로 승패가 갈린다(h-full이 h-[340px]를 덮어씀).
 * 크기는 전적으로 className에 위임한다.
 *
 * 첫 화면 밖이므로 lazy + async decode(히어로만 eager여야 함).
 */
function Figure({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={`bg-surface-muted object-cover ${className}`}
    />
  );
}

/** Core Value 목록 — 라임 도트 + 국문 정본, 영문은 병기(muted) */
function ValueList({ values, className = "" }: { values: typeof CORE_VALUES; className?: string }) {
  return (
    <ul className={`flex flex-col gap-[20px] ${className}`}>
      {values.map((v) => (
        <li key={v.ko} className="flex items-baseline gap-3">
          <Dot className="translate-y-[-3px]" />
          <span className="text-[24px] font-bold leading-none text-text-primary">{v.ko}</span>
          {v.en && <span className="text-[17px] leading-none text-text-muted">({v.en})</span>}
        </li>
      ))}
    </ul>
  );
}

export default function About() {
  return (
    <main style={{ fontFamily: INTER }}>
      {/* ═══════════ 데스크톱/노트북 (≥1280): Figma 절대좌표 1:1 캔버스 ═══════════ */}
      <section className="hidden xl:block">
        <FitCanvas w={1280} h={1680}>
          {/* Hero / intro — 43:4 : Inter Bold 150px, tracking -4px */}
          <h1 className="absolute left-[-8px] top-[30px] whitespace-nowrap text-[150px] font-bold leading-none tracking-[-4px] text-text-primary">
            ABOUT
          </h1>

          {/* ── Section 01 Mission (241:54) — 이미지 좌, 텍스트 우 ── */}
          <Figure
            src={SECTIONS[0].src}
            alt={SECTIONS[0].alt}
            className="absolute left-[12px] top-[293px] h-[340px] w-[600px]"
          />
          <Dot className="absolute left-[692px] top-[301px]" />
          <p className="absolute left-[714px] top-[295px] whitespace-nowrap text-[14px] font-medium text-text-muted">
            01
          </p>
          <p className="absolute left-[692px] top-[327px] whitespace-nowrap text-[34px] font-bold text-text-primary">
            Mission
          </p>
          <p className={`absolute left-[692px] top-[389px] w-[560px] ${BODY_TYPE}`}>{SECTIONS[0].body}</p>

          {/* ── Section 02 Vision (241:55) — 이미지 우, 텍스트 좌 ── */}
          {/*
            left=668은 Figma 원안(692)에서 24px 당긴 값.
            원안대로면 668+600=1292로 1280 캔버스를 12px 넘어가(가로 스크롤 유발),
            좌측 이미지 2장의 왼쪽 여백 12px과도 어긋난다. 1280-600-12=668로 좌우 대칭을 맞춘다.
          */}
          <Figure
            src={SECTIONS[1].src}
            alt={SECTIONS[1].alt}
            className="absolute left-[668px] top-[733px] h-[340px] w-[600px]"
          />
          <Dot className="absolute left-0 top-[739px]" />
          <p className="absolute left-[34px] top-[735px] whitespace-nowrap text-[14px] font-medium text-text-muted">
            02
          </p>
          <p className="absolute left-[12px] top-[767px] whitespace-nowrap text-[34px] font-bold text-text-primary">
            Vision
          </p>
          <p className={`absolute left-[12px] top-[829px] w-[560px] ${BODY_TYPE}`}>{SECTIONS[1].body}</p>

          {/* ── Section 03 Core Value (241:56) — 이미지 좌, 텍스트 우 ── */}
          <Figure
            src={SECTIONS[2].src}
            alt={SECTIONS[2].alt}
            className="absolute left-[12px] top-[1253px] h-[340px] w-[600px]"
          />
          <Dot className="absolute left-[692px] top-[1261px]" />
          <p className="absolute left-[714px] top-[1255px] whitespace-nowrap text-[14px] font-medium text-text-muted">
            03
          </p>
          <p className="absolute left-[692px] top-[1287px] whitespace-nowrap text-[34px] font-bold text-text-primary">
            Core Value
          </p>
          <ValueList values={CORE_VALUES} className="absolute left-[692px] top-[1349px] w-[560px]" />
        </FitCanvas>
      </section>

      {/* ═══════════ 모바일·태블릿·소형 노트북 (<1280): 세로 스택 ═══════════ */}
      <section className="xl:hidden">
        <div className="mx-auto max-w-[1280px] px-4 pb-12 pt-8 sm:px-6">
          <h1 className="whitespace-nowrap text-[clamp(56px,15vw,150px)] font-bold leading-none tracking-[-0.03em] text-text-primary">
            ABOUT
          </h1>

          <div className="mt-10 flex flex-col gap-12">
            {SECTIONS.map((s) => (
              <div key={s.n}>
                <Figure src={s.src} alt={s.alt} className="aspect-[600/340] w-full" />
                <div className="mt-4">
                  <p className="flex items-center gap-2 text-[14px] font-medium text-text-muted">
                    <Dot />
                    {s.n}
                  </p>
                  <h2 className="mt-2 text-[34px] font-bold leading-tight text-text-primary">{s.title}</h2>
                  {s.body && <p className={`mt-3 max-w-[560px] ${BODY_TYPE}`}>{s.body}</p>}
                  {s.values && <ValueList values={s.values} className="mt-4 max-w-[560px]" />}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
