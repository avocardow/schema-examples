-- funding_links: Stores supporter/funding URLs displayed on a show's page, ordered by position.
-- See README.md for full design rationale.

CREATE TABLE funding_links (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id     UUID        NOT NULL,
    url         TEXT        NOT NULL,
    title       TEXT        NOT NULL,
    position    INTEGER     NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE funding_links
    ADD CONSTRAINT fk_funding_links_show_id
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;

CREATE INDEX idx_funding_links_show_id_position ON funding_links (show_id, position);
