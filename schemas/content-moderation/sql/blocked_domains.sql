-- blocked_domains: Domain-level blocking with severity levels (full, media-only, report-reject).
-- See README.md for full design rationale.

CREATE TYPE blocked_domain_block_type AS ENUM ('full', 'media_only', 'report_reject');

CREATE TABLE blocked_domains (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  domain            TEXT UNIQUE NOT NULL,               -- The blocked domain (e.g., "spam-site.com").

  -- full = all content from this domain is blocked.
  -- media_only = text content allowed, media rejected.
  -- report_reject = reports from this domain's users are ignored.
  block_type        blocked_domain_block_type NOT NULL DEFAULT 'full',

  reason            TEXT,                               -- Why this domain was blocked.
  public_comment    TEXT,                               -- Comment visible to users about why the domain is blocked.
  private_comment   TEXT,                               -- Internal moderator note. Not visible to users.
  created_by        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_blocked_domains_block_type ON blocked_domains (block_type);
CREATE INDEX idx_blocked_domains_created_by ON blocked_domains (created_by);
