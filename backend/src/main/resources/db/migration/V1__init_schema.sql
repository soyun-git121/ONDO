-- ONDO 초기 스키마 (MySQL 8 / InnoDB / utf8mb4). db_schema.md와 1:1 대응.
--
-- 이 파일은 JPA 엔티티에서 Hibernate가 생성한 DDL을 기준으로 작성됐고,
-- 부팅 시 `ddl-auto: validate`가 엔티티와의 일치를 검증한다.
-- 컬럼 타입을 임의로 바꾸면 validate가 실패하므로 엔티티와 함께 수정할 것.
--
-- enum은 VARCHAR(20)로 저장한다(@JdbcTypeCode(SqlTypes.VARCHAR)).
-- 값 목록 CHECK는 일부러 걸지 않는다 — enum 상수 추가에 마이그레이션이 필요 없도록.

CREATE TABLE artisan (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    slug              VARCHAR(100) NOT NULL,
    name              VARCHAR(50)  NOT NULL,
    title             VARCHAR(50)  NOT NULL,
    designation       VARCHAR(20)  NOT NULL,
    short_intro       VARCHAR(200) NOT NULL,
    story             TEXT,
    profile_image_url VARCHAR(500),
    cover_image_url   VARCHAR(500),
    video_url         VARCHAR(500),
    sns_links         TEXT,
    display_order     INT    NOT NULL DEFAULT 0,
    is_published      BIT(1) NOT NULL DEFAULT b'0',
    created_at        DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at        DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_artisan_slug UNIQUE (slug),
    INDEX idx_artisan_published (is_published, display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE artisan_image (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    artisan_id BIGINT       NOT NULL,
    image_url  VARCHAR(500) NOT NULL,
    caption    VARCHAR(200),
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_ai_artisan FOREIGN KEY (artisan_id) REFERENCES artisan (id) ON DELETE CASCADE,
    INDEX idx_ai_artisan (artisan_id, sort_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE product (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    artisan_id     BIGINT       NOT NULL,
    slug           VARCHAR(100) NOT NULL,
    name           VARCHAR(100) NOT NULL,
    category       VARCHAR(20)  NOT NULL,
    price          INT          NOT NULL DEFAULT 0,
    summary        VARCHAR(300),
    description    TEXT,
    thumbnail_url  VARCHAR(500),
    stock_quantity INT         NOT NULL DEFAULT 0,
    status         VARCHAR(20) NOT NULL,
    external_url   VARCHAR(500),
    created_at     DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_product_slug UNIQUE (slug),
    -- 상품은 반드시 보유자 소속 — 보유자 삭제는 상품이 남아 있으면 막는다(RESTRICT).
    CONSTRAINT fk_product_artisan FOREIGN KEY (artisan_id) REFERENCES artisan (id),
    CONSTRAINT chk_product_price CHECK (price >= 0),
    CONSTRAINT chk_product_stock CHECK (stock_quantity >= 0),
    INDEX idx_product_artisan (artisan_id, status),
    INDEX idx_product_list (status, category, created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE product_image (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    product_id BIGINT       NOT NULL,
    image_url  VARCHAR(500) NOT NULL,
    caption    VARCHAR(200),
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_pi_product FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE CASCADE,
    INDEX idx_pi_product (product_id, sort_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- `order`는 예약어라 테이블명 복수형.
CREATE TABLE orders (
    id             BIGINT       NOT NULL AUTO_INCREMENT,
    order_number   VARCHAR(30)  NOT NULL,
    orderer_name   VARCHAR(50)  NOT NULL,
    phone          VARCHAR(20)  NOT NULL,
    email          VARCHAR(100),
    zipcode        VARCHAR(10)  NOT NULL,
    address        VARCHAR(300) NOT NULL,
    address_detail VARCHAR(200),
    memo           VARCHAR(300),
    total_amount   INT         NOT NULL DEFAULT 0,
    status         VARCHAR(20) NOT NULL,
    paid_at        DATETIME(6),
    created_at     DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at     DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_order_number UNIQUE (order_number),
    CONSTRAINT chk_order_amount CHECK (total_amount >= 0),
    INDEX idx_order_lookup (order_number, phone),
    INDEX idx_order_status (status, created_at)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 주문 상품은 스냅샷(product_name·artisan_name·price) — 정산 근거라 상품이 바뀌어도 불변.
-- 타임스탬프 없음: 주문 시점이 곧 orders.created_at.
CREATE TABLE order_item (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    order_id     BIGINT       NOT NULL,
    product_id   BIGINT,
    product_name VARCHAR(100) NOT NULL,
    artisan_name VARCHAR(50)  NOT NULL,
    price        INT NOT NULL,
    quantity     INT NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_oi_order FOREIGN KEY (order_id) REFERENCES orders (id) ON DELETE CASCADE,
    -- 상품이 삭제돼도 주문 기록은 남긴다 → SET NULL.
    CONSTRAINT fk_oi_product FOREIGN KEY (product_id) REFERENCES product (id) ON DELETE SET NULL,
    CONSTRAINT chk_oi_price CHECK (price >= 0),
    CONSTRAINT chk_oi_quantity CHECK (quantity > 0),
    INDEX idx_oi_order (order_id),
    INDEX idx_oi_product (product_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE news (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    title         VARCHAR(200) NOT NULL,
    thumbnail_url VARCHAR(500),
    type          VARCHAR(20) NOT NULL,
    content       TEXT,
    external_url  VARCHAR(500),
    source_name   VARCHAR(100),
    category      VARCHAR(20) NOT NULL,
    artisan_id    BIGINT,
    is_published  BIT(1) NOT NULL DEFAULT b'0',
    published_at  DATETIME(6),
    created_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    -- 보유자가 삭제돼도 뉴스는 남기고 연결만 끊는다.
    CONSTRAINT fk_news_artisan FOREIGN KEY (artisan_id) REFERENCES artisan (id) ON DELETE SET NULL,
    INDEX idx_news_list (is_published, category, published_at),
    INDEX idx_news_artisan (artisan_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE project (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    slug          VARCHAR(100) NOT NULL,
    title         VARCHAR(200) NOT NULL,
    type          VARCHAR(20)  NOT NULL,
    client_name   VARCHAR(100),
    summary       VARCHAR(300),
    description   TEXT,
    result_metric VARCHAR(200),
    thumbnail_url VARCHAR(500),
    project_date  DATE   NOT NULL,
    is_featured   BIT(1) NOT NULL DEFAULT b'0',
    display_order INT    NOT NULL DEFAULT 0,
    is_published  BIT(1) NOT NULL DEFAULT b'0',
    created_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_project_slug UNIQUE (slug),
    INDEX idx_project_list (is_published, type, project_date),
    INDEX idx_project_featured (is_featured, display_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

-- 프로젝트 참여 보유자 (N:M + role). 대리키 + (project_id, artisan_id) 유니크로 매핑 단순화.
CREATE TABLE project_artisan (
    id         BIGINT NOT NULL AUTO_INCREMENT,
    project_id BIGINT NOT NULL,
    artisan_id BIGINT NOT NULL,
    role       VARCHAR(100),
    PRIMARY KEY (id),
    CONSTRAINT uk_pa UNIQUE (project_id, artisan_id),
    CONSTRAINT fk_pa_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    CONSTRAINT fk_pa_artisan FOREIGN KEY (artisan_id) REFERENCES artisan (id) ON DELETE CASCADE,
    INDEX idx_pa_artisan (artisan_id)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE project_image (
    id         BIGINT       NOT NULL AUTO_INCREMENT,
    project_id BIGINT       NOT NULL,
    image_url  VARCHAR(500) NOT NULL,
    caption    VARCHAR(200),
    sort_order INT NOT NULL DEFAULT 0,
    created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_pji_project FOREIGN KEY (project_id) REFERENCES project (id) ON DELETE CASCADE,
    INDEX idx_pji_project (project_id, sort_order)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE inquiry (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    type         VARCHAR(20)  NOT NULL,
    company_name VARCHAR(100),
    contact_name VARCHAR(50)  NOT NULL,
    email        VARCHAR(100) NOT NULL,
    phone        VARCHAR(20),
    message      TEXT         NOT NULL,
    status       VARCHAR(20)  NOT NULL,
    admin_note   VARCHAR(500),
    created_at   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at   DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    INDEX idx_inquiry_status (status, created_at),
    INDEX idx_inquiry_type (type)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;

CREATE TABLE admin_user (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    username      VARCHAR(50)  NOT NULL,
    password      VARCHAR(100) NOT NULL,
    name          VARCHAR(50)  NOT NULL,
    role          VARCHAR(20)  NOT NULL DEFAULT 'ADMIN',
    last_login_at DATETIME(6),
    created_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    updated_at    DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
    PRIMARY KEY (id),
    CONSTRAINT uk_admin_username UNIQUE (username)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
