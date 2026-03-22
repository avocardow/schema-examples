-- screenshot_key_links: Maps translation keys to regions within screenshots.
-- See README.md for full design rationale.

CREATE TABLE screenshot_key_links (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  screenshot_id       UUID NOT NULL REFERENCES screenshots(id) ON DELETE CASCADE,
  translation_key_id  UUID NOT NULL REFERENCES translation_keys(id) ON DELETE CASCADE,
  x                   INTEGER,
  y                   INTEGER,
  width               INTEGER,
  height              INTEGER,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (screenshot_id, translation_key_id)
);

CREATE INDEX idx_screenshot_key_links_translation_key_id ON screenshot_key_links (translation_key_id);
