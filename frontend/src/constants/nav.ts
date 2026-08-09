/**
 * 공개 사이트 주 메뉴 — Header(GNB)와 Footer가 같은 배열을 쓴다.
 * 예전엔 두 파일에 같은 6개 항목을 복붙해 둬서 라벨을 바꿀 때마다 한쪽이 어긋났다.
 * 항목·라벨을 고칠 일이 있으면 여기만 고친다.
 *
 * 'Master'는 Figma 시안 라벨이다. types/artisan.ts의 Designation "MASTER"(명장)와
 * 글자만 같을 뿐 다른 개념이므로 — /artisans는 등급과 무관한 전체 보유자 목록 — 혼동 주의.
 */
export const SITE_NAV = [
  { to: "/about", label: "About" },
  { to: "/artisans", label: "Master" },
  { to: "/shop", label: "Shop" },
  { to: "/projects", label: "Project" },
  { to: "/news", label: "News" },
  { to: "/collaboration", label: "협업문의" },
] as const;
