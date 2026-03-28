-- ad_markers: Represents an advertising marker (pre/mid/post-roll) placed within a podcast episode.
-- See README.md for full design rationale.

CREATE TYPE ad_marker_type AS ENUM ('preroll', 'midroll', 'postroll');

CREATE TABLE ad_markers (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    episode_id      UUID            NOT NULL,
    marker_type     ad_marker_type  NOT NULL,
    position_ms     INTEGER,
    duration_ms     INTEGER,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

ALTER TABLE ad_markers
    ADD CONSTRAINT fk_ad_markers_episode_id
    FOREIGN KEY (episode_id) REFERENCES episodes(id) ON DELETE CASCADE;

CREATE INDEX idx_ad_markers_episode_id_marker_type
    ON ad_markers (episode_id, marker_type);
