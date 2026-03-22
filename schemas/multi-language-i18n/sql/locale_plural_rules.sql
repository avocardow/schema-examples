-- locale_plural_rules: Plural form categories and rules for each locale.
-- See README.md for full design rationale.

CREATE TYPE plural_category AS ENUM ('zero', 'one', 'two', 'few', 'many', 'other');

CREATE TABLE locale_plural_rules (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  locale_id         UUID NOT NULL REFERENCES locales(id) ON DELETE CASCADE,
  category          plural_category NOT NULL,
  example           TEXT,
  rule_formula      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (locale_id, category)
);

CREATE INDEX idx_locale_plural_rules_locale_id ON locale_plural_rules(locale_id);
