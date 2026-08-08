import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

/**
 * Figma 절대좌표 캔버스를 화면 폭에 맞춰 비율 축소하는 래퍼.
 *
 * 문제: 데스크톱 페이지들은 좌표를 1280 캔버스에 1:1로 박아 넣었는데,
 * 실제 콘텐츠는 캔버스를 벗어나기도 하고(Home −28~1320, Shop −17~1286)
 * 딱 맞는 페이지도 좌우 여백이 0이라 뷰포트 1280에서 화면 끝에 붙거나 가로 스크롤이 생겼다.
 *
 * 해결: 좌표는 한 글자도 건드리지 않고, 콘텐츠 실측 폭이 (가용폭 − 좌우 PAD)에
 * 들어가도록 transform: scale 만 적용한다. 캔버스 밖으로 나간 요소까지 포함해 재므로
 * 잘려나가는 부분이 없다. 축소만 하고 확대는 하지 않는다(scale ≤ 1).
 *
 * 측정에 getBoundingClientRect가 아니라 offsetLeft/offsetWidth를 쓰는 게 핵심 —
 * 이 값들은 CSS transform의 영향을 받지 않는 레이아웃 값이라, 스케일을 적용한 뒤
 * 다시 재도 항상 원본 좌표가 나온다(측정↔스케일 무한 루프가 생기지 않는다).
 */

/** 좌우 여백 — Header/Footer의 lg:px-5(20px)와 같은 정렬선. */
const PAD = 20;

export default function FitCanvas({
  w,
  h,
  children,
}: {
  /** 설계 캔버스 폭 (좌표 기준값) */
  w: number;
  /** 설계 캔버스 높이 */
  h: number;
  children: ReactNode;
}) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [offset, setOffset] = useState(0);
  /** 실측 콘텐츠 폭 — 캔버스 폭(w)이 아니다. 캔버스 밖으로 나간 요소까지 포함한 값. */
  const [contentW, setContentW] = useState(w);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    const inner = innerRef.current;
    if (!outer || !inner) return;

    const update = () => {
      // 캔버스를 기준으로 절대 배치된 요소만 골라 실제 좌우 범위를 잰다.
      let min = 0;
      let max = w;
      for (const el of Array.from(inner.querySelectorAll<HTMLElement>("*"))) {
        if (el.offsetParent !== inner) continue;
        min = Math.min(min, el.offsetLeft);
        max = Math.max(max, el.offsetLeft + el.offsetWidth);
      }

      const cw = Math.max(1, max - min);
      const avail = Math.max(1, outer.clientWidth - PAD * 2);
      const s = Math.min(1, avail / cw);
      setScale(s);
      setContentW(cw);
      // 왼쪽으로 삐져나간 만큼(min<0) 밀어 넣어 콘텐츠 왼쪽 끝을 0에 맞춘다.
      setOffset(-min * s);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(outer);
    // 웹폰트가 늦게 뜨면 nowrap 텍스트 폭이 바뀌므로 다시 잰다.
    document.fonts?.ready.then(update).catch(() => {});
    return () => ro.disconnect();
  }, [w, h]);

  return (
    <div ref={outerRef} style={{ paddingLeft: PAD, paddingRight: PAD }}>
      {/*
        폭은 캔버스(w)가 아니라 '렌더된 콘텐츠 폭'(contentW×scale)이어야 한다.
        w로 두면 scale이 1로 고정되는 넓은 화면에서 캔버스 밖 콘텐츠(Home은 오른쪽 +40)가
        이 박스를 삐져나가 mx-auto 중앙정렬이 어긋나고 PAD가 보장되지 않는다.
      */}
      <div className="relative mx-auto" style={{ width: contentW * scale, height: h * scale }}>
        <div
          ref={innerRef}
          className="absolute left-0 top-0"
          style={{
            width: w,
            height: h,
            transformOrigin: "top left",
            transform: `translateX(${offset}px) scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
