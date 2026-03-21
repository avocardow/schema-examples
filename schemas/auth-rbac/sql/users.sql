-- users: Central identity record. One row per human (or anonymous) user.
-- See README.md for full design rationale and field documentation.

CREATE TABLE users (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email                 TEXT UNIQUE,                -- Always store lowercase. Nullable for anonymous or phone-only users.
  email_verified_at     TIMESTAMPTZ,
  phone                 TEXT UNIQUE,                -- E.164 format (e.g., "+15551234567").
  phone_verified_at     TIMESTAMPTZ,
  name                  TEXT,                       -- Display name. Not used for auth.
  first_name            TEXT,
  last_name             TEXT,
  username              TEXT UNIQUE,
  image_url             TEXT,

  is_anonymous          BOOLEAN NOT NULL DEFAULT FALSE, -- Guest users that can upgrade to full accounts.

  -- Ban = admin decision (ToS violation). Lock = automated (brute-force protection).
  banned                BOOLEAN NOT NULL DEFAULT FALSE,
  banned_reason         TEXT,
  banned_until          TIMESTAMPTZ,                -- NULL = permanent ban.
  locked                BOOLEAN NOT NULL DEFAULT FALSE,
  locked_until          TIMESTAMPTZ,                -- Auto-unlock after this time.
  failed_login_attempts INTEGER NOT NULL DEFAULT 0, -- Reset to 0 on successful login. Lock when threshold hit.
  last_failed_login_at  TIMESTAMPTZ,

  -- Two-tier metadata prevents privilege escalation via client-side manipulation.
  -- public: client-readable, server-writable (preferences, theme).
  -- private: server-only (Stripe ID, internal notes). Never expose to client.
  public_metadata       JSONB DEFAULT '{}',
  private_metadata      JSONB DEFAULT '{}',

  external_id           TEXT UNIQUE,                -- Link to external system (legacy DB, CRM).
  last_sign_in_at       TIMESTAMPTZ,
  last_sign_in_ip       TEXT,                       -- Consider privacy regulations before storing.
  sign_in_count         INTEGER NOT NULL DEFAULT 0,

  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Soft delete: keeps row for audit trails, but may conflict with GDPR/CCPA
  -- hard-delete requirements. See README for trade-off discussion.
  deleted_at            TIMESTAMPTZ
);

CREATE INDEX idx_users_external_id ON users (external_id) WHERE external_id IS NOT NULL;
CREATE INDEX idx_users_created_at ON users (created_at);
