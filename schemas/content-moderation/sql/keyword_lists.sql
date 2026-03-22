-- keyword_lists: Managed collections of words, phrases, and patterns for auto-moderation rules.
-- See README.md for full design rationale.

CREATE TYPE keyword_list_type AS ENUM ('blocklist', 'allowlist', 'watchlist');
CREATE TYPE keyword_list_scope AS ENUM ('global', 'community');

CREATE TABLE keyword_lists (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,                        -- List name (e.g., "Profanity — English", "Competitor URLs").
  description     TEXT,                                 -- What this list contains and how it's used.

  -- blocklist = content matching these entries is blocked/flagged.
  -- allowlist = entries that override blocklist matches.
  -- watchlist = entries that flag content for review.
  list_type       keyword_list_type NOT NULL,

  scope           keyword_list_scope NOT NULL DEFAULT 'global',
  scope_id        TEXT,                                 -- Community ID. Null when scope = global.
  is_enabled      BOOLEAN NOT NULL DEFAULT TRUE,
  created_by      UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_keyword_lists_scope_scope_id ON keyword_lists (scope, scope_id);
CREATE INDEX idx_keyword_lists_list_type ON keyword_lists (list_type);
CREATE INDEX idx_keyword_lists_is_enabled ON keyword_lists (is_enabled);
