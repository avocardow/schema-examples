-- post_authors: Many-to-many relationship between posts and authors with role attribution.
-- See README.md for full design rationale.

CREATE TYPE post_author_role AS ENUM ('author', 'contributor', 'editor', 'guest');

CREATE TABLE post_authors (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id         UUID NOT NULL,
    author_id       UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    role            post_author_role NOT NULL DEFAULT 'author',

    UNIQUE (post_id, author_id)
);

CREATE INDEX idx_post_authors_author_id ON post_authors (author_id);

-- Forward FK: posts is defined in posts.sql (loaded after post_authors.sql).
ALTER TABLE post_authors ADD CONSTRAINT fk_post_authors_post_id
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE;
