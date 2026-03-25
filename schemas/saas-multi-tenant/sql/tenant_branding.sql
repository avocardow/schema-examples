-- tenant_branding: Per-organization visual identity and support contact settings.
-- See README.md for full design rationale.

CREATE TABLE tenant_branding (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id  UUID UNIQUE NOT NULL REFERENCES organizations (id) ON DELETE CASCADE,
  logo_url         TEXT,
  logo_dark_url    TEXT,
  favicon_url      TEXT,
  primary_color    TEXT,
  accent_color     TEXT,
  background_color TEXT,
  custom_css       TEXT,
  support_email    TEXT,
  support_url      TEXT,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
