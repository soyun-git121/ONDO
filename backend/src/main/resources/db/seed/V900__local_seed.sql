-- 로컬(local) 프로파일 전용 시드. prod는 spring.flyway.locations에 db/seed를 넣지 않아 실행되지 않는다.
-- dev(H2)의 data.sql과 같은 내용 — 하드코딩 금지 원칙에 따라 시드는 이 파일들로만 관리한다.
-- 버전을 900번대로 둬서 이후 추가되는 스키마 마이그레이션(V2, V3…) 뒤에 실행되게 한다.

INSERT INTO artisan
(id, slug, name, title, designation, short_intro, story, profile_image_url, cover_image_url, video_url, sns_links,
 display_order, is_published)
VALUES (1, 'yoon-jongguk', '윤종국', '악기장', 'HOLDER', '600여 년 전통 북 제작을 잇는 국가무형유산 악기장',
        '## 600여 년 전통을 잇다

600여 년 전통의 한국 북 제작 기술을 오늘에 이어가는 국가무형유산 악기장 보유자, 윤종국.',
        '/uploads/sample/yoon_jongguk_profile.jpg', '/uploads/sample/artisan-yoon-cover.svg', NULL,
        '{"instagram":"https://instagram.com/"}', 0, 1);

INSERT INTO artisan_image (artisan_id, image_url, caption, sort_order)
VALUES (1, '/uploads/sample/gongbang-1.svg', '공방 전경', 0),
       (1, '/uploads/sample/work-1.svg', '북메우기 작업', 1);

-- 윤종국 미니 오브제 시리즈 (GOODS, 각 100,000원, 판매중)
INSERT INTO product
(id, artisan_id, slug, name, category, price, summary, description, thumbnail_url, stock_quantity, status, external_url)
VALUES (3, 1, 'mini-janggu-object', '미니 장구 오브제', 'GOODS', 100000, '손안에 담은 장구',
        '## 미니 장구 오브제

윤종국 악기장의 손끝에서 태어난 미니 장구 오브제.', '/uploads/sample/product-mini-janggu.png', 10, 'ON_SALE', NULL),
       (4, 1, 'mini-buk-object', '미니 북 오브제', 'GOODS', 100000, '손안에 담은 북',
        '## 미니 북 오브제

윤종국 악기장의 손끝에서 태어난 미니 북 오브제.', '/uploads/sample/product-mini-buk-object.png', 10, 'ON_SALE', NULL),
       -- 주문 제작 작품 — 가격·재고 없이 문의로만 진행(INQUIRY_ONLY). db_schema.md §3: price 0 허용.
       (5, 1, 'buk-custom-order', '전통 북 주문 제작', 'ARTWORK', 0, '공방에서 직접 제작하는 맞춤 전통 북',
        '## 전통 북 주문 제작

크기·가죽·단청을 상의해 공방에서 직접 제작합니다. 협업 문의로 연락 주세요.', NULL, 0, 'INQUIRY_ONLY', NULL);

INSERT INTO product_image (product_id, image_url, caption, sort_order)
VALUES (3, '/uploads/sample/product-mini-janggu.png', NULL, 0),
       (4, '/uploads/sample/product-mini-buk-object.png', NULL, 0);

-- 협업 실적: 텀블벅 펀딩 (대표 실적 → 홈·협업문의 페이지 노출)
INSERT INTO project
(id, slug, title, type, client_name, summary, description, result_metric, thumbnail_url,
 project_date, is_featured, display_order, is_published)
VALUES (1, 'tumblbug-buk', '텀블벅 전통 북 펀딩 — 미니 북 오브제', 'FUNDING', '텀블벅',
        '전통 북을 손안의 오브제로 옮긴 첫 펀딩',
        '## 배경

전통 악기는 보고 듣는 것에 그쳤습니다. 곁에 두고 만질 수 있는 물건으로 옮겨 보자는 데서 출발했습니다.

## 진행

윤종국 악기장이 실제 북 제작 공정을 그대로 축소해 오브제를 만들었습니다.

## 결과

목표 금액의 12배를 모으며 마감했습니다.', '펀딩률 1,200% 달성', '/uploads/sample/project-tumblbug-buk.png',
        '2026-03-15', 1, 0, 1);

INSERT INTO project_image (project_id, image_url, caption, sort_order)
VALUES (1, '/uploads/sample/project-tumblbug-buk-1.png', '펀딩 페이지 대표 이미지', 0);

INSERT INTO project_artisan (project_id, artisan_id, role)
VALUES (1, 1, '전통 북 제작');

-- 뉴스: 자체 작성(ORIGINAL, 윤종국 연결) + 외부 큐레이션(CURATED)
INSERT INTO news
(id, title, thumbnail_url, type, content, external_url, source_name, category, artisan_id, is_published, published_at)
VALUES (1, '온도, 악기장 윤종국과 함께합니다', '/uploads/sample/news-ondo-yoon.svg', 'ORIGINAL',
        '## 온도의 첫 보유자

4대 가업 북메우기, 윤종국 악기장과 함께합니다.', NULL, NULL, 'ONDO_NEWS', 1, 1, '2026-07-01 09:00:00'),
       (2, '전통 북의 재발견', '/uploads/sample/news-buk-rediscover.svg', 'CURATED',
        NULL, 'https://example.com/article', '연합뉴스', 'TRADITION', NULL, 1, '2026-06-20 09:00:00');
