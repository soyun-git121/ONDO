-- 이미 저장돼 버린 잘못된 slug를 정리한다.
--
-- 187d15a에서 Create 요청에 @Pattern(SlugPattern)을 걸어 새로 들어오는 값은 막았지만,
-- 그 전에 들어간 행은 그대로 남아 상세 페이지가 계속 404였다.
-- (운영: project.slug = "불국사 한정판  ", "ONDO의 첫 MOU" 두 건.
--  브라우저는 경로 앞뒤 공백을 정리해 보내는데 DB 값은 뒤 공백을 갖고 있어 조회가 어긋난다.)
-- slug는 Update 요청 DTO에 아예 없어(불변) 관리자 화면에서 고칠 수 없으므로 여기서 바로잡는다.
--
-- REGEXP는 컬럼 콜레이션(utf8mb4_0900_ai_ci)을 따라가서 대소문자를 구분하지 않는다.
-- 그대로 쓰면 'ABC'가 '^[a-z0-9]+$'에 매치돼 버리므로 _as_cs로 강제 비교한다.

-- 1) 앞뒤 공백 제거 — 값 자체는 멀쩡한데 공백 때문에만 어긋난 행을 살린다.
UPDATE artisan SET slug = TRIM(slug) WHERE slug <> TRIM(slug);
UPDATE product SET slug = TRIM(slug) WHERE slug <> TRIM(slug);
UPDATE project SET slug = TRIM(slug) WHERE slug <> TRIM(slug);

-- 2) 운영에서 확인된 두 건 — 사람이 읽을 수 있는 URL로 바꾼다.
--    지금 링크는 어차피 404라 바뀐 주소 때문에 잃을 유입이 없다.
UPDATE project SET slug = 'bulguksa-limited' WHERE slug = '불국사 한정판';
UPDATE project SET slug = 'ondo-first-mou'   WHERE slug = 'ONDO의 첫 MOU';

-- 3) 그 밖에 형식을 벗어난 값이 남아 있으면 id 기반 slug로 강제한다.
--    한글을 자동으로 로마자화하면 결과를 예측할 수 없어, 깨진 URL 대신 최소한 동작하는 URL을 준다.
--    (관리자가 나중에 더 나은 이름으로 바꾸려면 삭제 후 재등록이 필요하다.)
UPDATE artisan SET slug = CONCAT('artisan-', id)
WHERE NOT ((slug COLLATE utf8mb4_0900_as_cs) REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$');

UPDATE product SET slug = CONCAT('product-', id)
WHERE NOT ((slug COLLATE utf8mb4_0900_as_cs) REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$');

UPDATE project SET slug = CONCAT('project-', id)
WHERE NOT ((slug COLLATE utf8mb4_0900_as_cs) REGEXP '^[a-z0-9]+(-[a-z0-9]+)*$');
