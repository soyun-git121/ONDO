/**
 * 공식 소셜 계정 — 푸터·뉴스 등 여러 화면에서 참조한다.
 * 공유 QR이 붙여주는 추적 파라미터(igsh, utm_source)는 프로필 접근에 불필요하므로 뺀 주소를 쓴다.
 */
export const SOCIAL = {
  /** 본계정. */
  instagram: "https://www.instagram.com/ondo_kor",
  /** 온도 매거진(카드뉴스) 계정 — 본계정과 분리 운영. */
  instagramMagazine: "https://www.instagram.com/ondo_mag",
  /** 개설 전. 채널이 열리면 URL을 넣으면 되고, null인 동안 UI는 '준비 중'으로 그린다. */
  youtube: null,
} as const;
