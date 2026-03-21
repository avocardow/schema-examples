-- organizations: Top-level tenant / workspace / company for multi-tenant apps.
-- See README.md for full design rationale and field documentation.

CREATE TABLE organizations (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name                TEXT NOT NULL,
  slug                TEXT UNIQUE NOT NULL,         -- URL-safe identifier (e.g., "acme-corp").
  logo_url            TEXT,

  external_id         TEXT UNIQUE,                  -- Link to external system (billing, CRM).
  stripe_customer_id  TEXT UNIQUE,

  max_members         INTEGER,                      -- Plan-based limit. NULL = unlimited. Enforced in app logic.

  -- Two-tier metadata (same pattern as users).
  -- public: client-readable, server-writable. private: server-only.
  public_metadata     JSONB DEFAULT '{}',
  private_metadata    JSONB DEFAULT '{}',

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at          TIMESTAMPTZ                   -- Soft delete. Same GDPR considerations as users.
);
