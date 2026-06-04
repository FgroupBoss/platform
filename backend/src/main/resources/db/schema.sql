CREATE TABLE IF NOT EXISTS media_asset (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    file_name     VARCHAR(255) NOT NULL,
    file_path     VARCHAR(500) NOT NULL,
    media_type    VARCHAR(20) NOT NULL,
    mime_type     VARCHAR(100),
    file_size     BIGINT,
    duration_sec  INT,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS poem (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(100) NOT NULL,
    author        VARCHAR(50),
    dynasty       VARCHAR(20),
    lines         JSON NOT NULL,
    pinyin        JSON,
    translation   TEXT,
    difficulty    VARCHAR(20) DEFAULT 'easy',
    tags          JSON,
    cover_id      BIGINT,
    audio_id      BIGINT,
    video_id      BIGINT,
    status        VARCHAR(20) DEFAULT 'draft',
    sort_order    INT DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_poem_cover FOREIGN KEY (cover_id) REFERENCES media_asset(id),
    CONSTRAINT fk_poem_audio FOREIGN KEY (audio_id) REFERENCES media_asset(id),
    CONSTRAINT fk_poem_video FOREIGN KEY (video_id) REFERENCES media_asset(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS story (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    title         VARCHAR(200) NOT NULL,
    story_type    VARCHAR(30),
    paragraphs    JSON NOT NULL,
    age_min       INT DEFAULT 3,
    cover_id      BIGINT,
    audio_id      BIGINT,
    video_id      BIGINT,
    status        VARCHAR(20) DEFAULT 'draft',
    sort_order    INT DEFAULT 0,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_story_cover FOREIGN KEY (cover_id) REFERENCES media_asset(id),
    CONSTRAINT fk_story_audio FOREIGN KEY (audio_id) REFERENCES media_asset(id),
    CONSTRAINT fk_story_video FOREIGN KEY (video_id) REFERENCES media_asset(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS admin_user (
    id            BIGINT PRIMARY KEY AUTO_INCREMENT,
    username      VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
