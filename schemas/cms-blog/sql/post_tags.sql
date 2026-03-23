-- post_tags: Many-to-many relationship between posts and tags with ordering.
-- See README.md for full design rationale.

CREATE TABLE post_tags (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL,
    tag_id          UUID NOT NULL,
    sort_order      INTEGER NOT NULL DEFAULT 0,

    UNIQUE (post_id, tag_id)
);

CREATE INDEX idx_post_tags_tag_id ON post_tags (tag_id);

-- Forward FK: posts is defined in posts.sql (loaded after post_tags.sql).
ALTER TABLE post_tags ADD CONSTRAINT fk_post_tags_post_id
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;

-- Forward FK: tags is defined in tags.sql (loaded after post_tags.sql).
ALTER TABLE post_tags ADD CONSTRAINT fk_post_tags_tag_id
  FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE;
