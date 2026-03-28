-- show_tags: Associates free-form tags with a show for search and discovery.
-- See README.md for full design rationale.

CREATE TABLE show_tags (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    show_id     UUID    NOT NULL,
    tag         TEXT    NOT NULL,
    UNIQUE (show_id, tag)
);

ALTER TABLE show_tags
    ADD CONSTRAINT fk_show_tags_show_id
    FOREIGN KEY (show_id) REFERENCES shows(id) ON DELETE CASCADE;

CREATE INDEX idx_show_tags_tag ON show_tags (tag);
