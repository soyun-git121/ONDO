-- dev 시드 데이터 (H2 전용, ddl-auto: create-drop 후 실행됨)
-- 하드코딩 금지 원칙: 시드는 이 파일로만 관리한다. (claude.md 참조)
-- 파일럿: 악기장 윤종국 보유자 + 공방 갤러리.
-- TODO(도메인 확장 시): admin 계정, 샘플 상품, 샘플 협업 실적(텀블벅 펀딩 등) 추가.

INSERT INTO artisan
(id, slug, name, title, designation, short_intro, story, profile_image_url, cover_image_url, video_url, sns_links, display_order, is_published, created_at, updated_at)
VALUES
(1, 'yoon-jongguk', '윤종국', '악기장', 'HOLDER', '600여 년 전통 북 제작을 잇는 국가무형유산 악기장',
 '## 600여 년 전통을 잇다

600여 년 전통의 한국 북 제작 기술을 오늘에 이어가는 국가무형유산 악기장 보유자, 윤종국.',
 '/uploads/sample/yoon_jongguk_profile.jpg', '/uploads/sample/artisan-yoon-cover.svg', NULL,
 '{"instagram":"https://instagram.com/"}', 0, TRUE, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO artisan_image
(artisan_id, image_url, caption, sort_order, created_at, updated_at)
VALUES
(1, '/uploads/sample/gongbang-1.svg', '공방 전경', 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(1, '/uploads/sample/work-1.svg', '북메우기 작업', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 윤종국 미니 오브제 시리즈 (GOODS, 각 100,000원, 판매중)
INSERT INTO product
(id, artisan_id, slug, name, category, price, summary, description, thumbnail_url, stock_quantity, status, external_url, created_at, updated_at)
VALUES
(3, 1, 'mini-janggu-object', '미니 장구 오브제', 'GOODS', 100000,
 '손안에 담은 장구', '## 미니 장구 오브제

윤종국 악기장의 손끝에서 태어난 미니 장구 오브제.', '/uploads/sample/product-mini-janggu.png', 10, 'ON_SALE', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 1, 'mini-buk-object', '미니 북 오브제', 'GOODS', 100000,
 '손안에 담은 북', '## 미니 북 오브제

윤종국 악기장의 손끝에서 태어난 미니 북 오브제.', '/uploads/sample/product-mini-buk-object.png', 10, 'ON_SALE', NULL,
 CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO product_image
(product_id, image_url, caption, sort_order, created_at, updated_at)
VALUES
(3, '/uploads/sample/product-mini-janggu.png', NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, '/uploads/sample/product-mini-buk-object.png', NULL, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 협업 실적(Project): 아직 없음 — admin CRUD 또는 시드로 추가 예정

-- 뉴스: 자체 작성(ORIGINAL, 윤종국 연결) + 외부 큐레이션(CURATED)
INSERT INTO news
(id, title, thumbnail_url, type, content, external_url, source_name, category, artisan_id, is_published, published_at, created_at, updated_at)
VALUES
(1, '온도, 악기장 윤종국과 함께합니다', '/uploads/sample/news-ondo-yoon.svg', 'ORIGINAL',
 '## 온도의 첫 보유자

4대 가업 북메우기, 윤종국 악기장과 함께합니다.', NULL, NULL, 'ONDO_NEWS', 1, TRUE,
 '2026-07-01 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, '전통 북의 재발견', '/uploads/sample/news-buk-rediscover.svg', 'CURATED',
 NULL, 'https://example.com/article', '연합뉴스', 'TRADITION', NULL, TRUE,
 '2026-06-20 09:00:00', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
