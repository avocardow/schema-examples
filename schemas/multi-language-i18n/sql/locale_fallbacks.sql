-- locale_fallbacks: Priority-ordered fallback chain for missing translations in a locale.
-- See README.md for full design rationale.

CREATE TABLE locale_fallbacks (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale_id           UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  fallback_locale_id  UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  priority            INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (locale_id, fallback_locale_id),
  UNIQUE (locale_id, priority)
);
