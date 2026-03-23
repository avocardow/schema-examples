-- posts: Core content entries supporting posts and pages with SEO metadata.
-- See README.md for full design rationale.

CREATE TYPE post_type AS ENUM ('post', 'page');
CREATE TYPE post_status AS ENUM ('draft', 'scheduled', 'published', 'archived');
CREATE TYPE post_visibility AS ENUM ('public', 'private', 'password_protected');

CREATE TABLE posts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type                post_type NOT NULL DEFAULT 'post',
    title               TEXT NOT NULL,
    slug                TEXT NOT NULL UNIQUE,
    excerpt             TEXT,
    content             TEXT,
    featured_image_url  TEXT,
    status              post_status NOT NULL DEFAULT 'draft',
    visibility          post_visibility NOT NULL DEFAULT 'public',
    password            TEXT,
    is_featured         BOOLEAN NOT NULL DEFAULT FALSE,
    allow_comments      BOOLEAN NOT NULL DEFAULT TRUE,
    meta_title          TEXT,
    meta_description    TEXT,
    og_image_url        TEXT,
    published_at        TIMESTAMPTZ,
    created_by          UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    updated_by          UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_posts_status_published_at ON posts (status, published_at);
CREATE INDEX idx_posts_type_status ON posts (type, status);
CREATE INDEX idx_posts_created_by ON posts (created_by);
CREATE INDEX idx_posts_is_featured ON posts (is_featured);
