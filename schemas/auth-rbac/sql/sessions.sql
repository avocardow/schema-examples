-- sessions: Active login sessions. Tracks *how* the user authenticated, not just *that* they did.
-- See README.md for full design rationale and field documentation.

CREATE TYPE aal_level AS ENUM ('aal1', 'aal2', 'aal3');

CREATE TABLE sessions (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash        TEXT UNIQUE NOT NULL,           -- SHA-256 hash. Never store raw session tokens.

  -- Authentication Assurance Level: aal1 = password/OAuth, aal2 = MFA verified, aal3 = hardware key.
  aal               aal_level NOT NULL DEFAULT 'aal1',

  mfa_factor_id     UUID REFERENCES mfa_factors(id) ON DELETE SET NULL,
  ip_address        TEXT,
  user_agent        TEXT,
  country_code      CHAR(2),                        -- ISO 3166-1 alpha-2, derived from IP.

  organization_id   UUID REFERENCES organizations(id) ON DELETE SET NULL, -- Active org context for multi-tenant apps.
  impersonator_id   UUID REFERENCES users(id) ON DELETE SET NULL,         -- Set when an admin is impersonating this user.

  tag               TEXT,                           -- Custom label (e.g., "mobile", "api").
  last_active_at    TIMESTAMPTZ,
  expires_at        TIMESTAMPTZ NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions (user_id);
CREATE INDEX idx_sessions_expires_at ON sessions (expires_at);
