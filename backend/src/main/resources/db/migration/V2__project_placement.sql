-- 실적 노출 위치를 페이지별로 분리한다.
-- 기존 is_featured 하나로 홈·협업문의를 함께 켜고 껐던 것을, 각각 따로 고를 수 있게 두 컬럼으로 나눈다.
-- 기존 대표 실적은 두 페이지 모두에 노출되던 것이므로 둘 다 true로 옮긴다.

ALTER TABLE project
    ADD COLUMN show_on_home          BIT(1) NOT NULL DEFAULT b'0' AFTER project_date,
    ADD COLUMN show_on_collaboration BIT(1) NOT NULL DEFAULT b'0' AFTER show_on_home;

UPDATE project
SET show_on_home = is_featured,
    show_on_collaboration = is_featured;

ALTER TABLE project DROP INDEX idx_project_featured;
ALTER TABLE project DROP COLUMN is_featured;

CREATE INDEX idx_project_home ON project (show_on_home, display_order);
CREATE INDEX idx_project_collaboration ON project (show_on_collaboration, display_order);
