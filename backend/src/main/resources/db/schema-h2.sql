CREATE TABLE IF NOT EXISTS media_asset (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    file_name     VARCHAR(255) NOT NULL,
    file_path     VARCHAR(500) NOT NULL,
    media_type    VARCHAR(20) NOT NULL,
    mime_type     VARCHAR(100),
    file_size     BIGINT,
    duration_sec  INT,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS poem (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(100) NOT NULL,
    author        VARCHAR(50),
    dynasty       VARCHAR(20),
    lines         CLOB NOT NULL,
    pinyin        CLOB,
    translation   CLOB,
    difficulty    VARCHAR(20) DEFAULT 'easy',
    tags          CLOB,
    cover_id      BIGINT,
    audio_id      BIGINT,
    video_id      BIGINT,
    status        VARCHAR(20) DEFAULT 'draft',
    sort_order    INT DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS story (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    title         VARCHAR(200) NOT NULL,
    story_type    VARCHAR(30),
    paragraphs    CLOB NOT NULL,
    age_min       INT DEFAULT 3,
    cover_id      BIGINT,
    audio_id      BIGINT,
    video_id      BIGINT,
    status        VARCHAR(20) DEFAULT 'draft',
    sort_order    INT DEFAULT 0,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_user (
    id            BIGINT AUTO_INCREMENT PRIMARY KEY,
    username      VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
