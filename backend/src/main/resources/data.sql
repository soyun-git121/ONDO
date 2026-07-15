-- dev 시드 데이터 (H2 전용, ddl-auto: create-drop 후 실행됨)
-- 하드코딩 금지 원칙: 시드는 이 파일로만 관리한다. (claude.md 참조)
-- 파일럿: 악기장 윤종국 보유자 + 공방 갤러리.
-- TODO(도메인 확장 시): admin 계정, 샘플 상품, 샘플 협업 실적(텀블벅 펀딩 등) 추가.

INSERT INTO artisan
(id, slug, name, title, designation, short_intro, story, profile_image_url, cover_image_url, video_url, sns_links, display_order, is_published, created_at, updated_at)
VALUES
(1, 'yoon-jongguk', '윤종국', '악기장', 'HOLDER', '4대 가업, 북메우기',
 '## 4대를 이어온 소리

가죽을 씌워 소리를 되살리는 북메우기. 윤종국 악기장은 4대에 걸쳐 그 소리를 잇는다.',
 NULL, NULL, NULL,
 '{"instagram":"https://instagram.com/"}', 0, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO artisan_image
(artisan_id, image_url, caption, sort_order, created_at, updated_at)
VALUES
(1, '/uploads/sample/gongbang-1.webp', '공방 전경', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '/uploads/sample/work-1.webp', '북메우기 작업', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 윤종국(artisan_id=1) 샘플 상품: 판매형 소품 + 문의형 작품
INSERT INTO product
(id, artisan_id, slug, name, category, price, summary, description, thumbnail_url, stock_quantity, status, external_url, created_at, updated_at)
VALUES
(1, 1, 'mini-buk', '미니어처 전통 북', 'GOODS', 45000,
 '손안에 담긴 북메우기', '## 미니어처 전통 북

윤종국 악기장이 만든 손바닥 크기의 전통 북.', NULL, 20, 'ON_SALE', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 1, 'jeontong-buk', '전통 북 (주문 제작)', 'ARTWORK', 0,
 '건별 협의 제작', '## 전통 북

크기·가죽·소리 결에 따라 건별로 협의해 제작합니다.', NULL, 0, 'INQUIRY_ONLY', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product_image
(product_id, image_url, caption, sort_order, created_at, updated_at)
VALUES
(1, '/uploads/sample/mini-buk-1.webp', NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 협업 실적: 윤종국 참여 텀블벅 펀딩
INSERT INTO project
(id, slug, title, type, client_name, summary, description, result_metric, thumbnail_url, project_date, is_featured, display_order, is_published, created_at, updated_at)
VALUES
(1, 'tumblbug-buk', '미니어처 전통 북 텀블벅 펀딩', 'FUNDING', '텀블벅',
 '손안의 전통 북 크라우드펀딩', '## 배경

전통 북을 일상 곁으로.

## 결과

목표 대비 완판.', '펀딩률 1,200% 달성', NULL, '2026-04-01', TRUE, 0, TRUE,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO project_artisan (project_id, artisan_id, role) VALUES (1, 1, '전통 북 제작');

INSERT INTO project_image
(project_id, image_url, caption, sort_order, created_at, updated_at)
VALUES
(1, '/uploads/sample/tumblbug-1.webp', '펀딩 페이지', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 뉴스: 자체 작성(ORIGINAL, 윤종국 연결) + 외부 큐레이션(CURATED)
INSERT INTO news
(id, title, thumbnail_url, type, content, external_url, source_name, category, artisan_id, is_published, published_at, created_at, updated_at)
VALUES
(1, '온도, 악기장 윤종국과 함께합니다', NULL, 'ORIGINAL',
 '## 온도의 첫 보유자

4대 가업 북메우기, 윤종국 악기장과 함께합니다.', NULL, NULL, 'ONDO_NEWS', 1, TRUE,
 '2026-07-01 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '전통 북의 재발견', NULL, 'CURATED',
 NULL, 'https://example.com/article', '연합뉴스', 'TRADITION', NULL, TRUE,
 '2026-06-20 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
