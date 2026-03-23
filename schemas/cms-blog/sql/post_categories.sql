-- post_categories: Many-to-many relationship between posts and categories.
-- See README.md for full design rationale.

CREATE TABLE post_categories (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL,
    category_id     UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,

    UNIQUE (post_id, category_id)
);

CREATE INDEX idx_post_categories_category_id ON post_categories (category_id);

-- Forward FK: posts is defined in posts.sql (loaded after post_categories.sql).
ALTER TABLE post_categories ADD CONSTRAINT fk_post_categories_post_id
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
