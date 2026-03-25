-- kb_articles: Knowledge base articles for self-service and agent reference.
-- See README.md for full design rationale.

CREATE TYPE kb_article_status AS ENUM ('draft', 'published', 'archived');

CREATE TABLE kb_articles (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id      UUID,
  title            TEXT NOT NULL,
  slug             TEXT NOT NULL UNIQUE,
  body             TEXT NOT NULL,
  status           kb_article_status NOT NULL DEFAULT 'draft',
  author_id        UUID NOT NULL REFERENCES users (id) ON DELETE RESTRICT,
  view_count       INTEGER NOT NULL DEFAULT 0,
  helpful_count    INTEGER NOT NULL DEFAULT 0,
  not_helpful_count INTEGER NOT NULL DEFAULT 0,
  published_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Forward FK: kb_categories loads after kb_articles alphabetically.
ALTER TABLE kb_articles
  ADD CONSTRAINT fk_kb_articles_category
  FOREIGN KEY (category_id) REFERENCES kb_categories (id) ON DELETE SET NULL;

CREATE INDEX idx_kb_articles_category_id ON kb_articles (category_id);
CREATE INDEX idx_kb_articles_status ON kb_articles (status);
CREATE INDEX idx_kb_articles_author_id ON kb_articles (author_id);
