-- verification_tokens: Unified one-time tokens for email verification, password reset,
-- magic links, phone verification, and platform invitations.
-- Org-specific invitations use organization_invitations instead.
-- See README.md for full design rationale and field documentation.

CREATE TYPE token_type AS ENUM (
  'email_verification',
  'phone_verification',
  'password_reset',
  'magic_link',
  'invitation'              -- Platform-level invitations only. Org invitations have their own table.
);

CREATE TABLE verification_tokens (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,  -- Nullable: some tokens exist before a user record (e.g., magic link signup).
  token_hash      TEXT UNIQUE NOT NULL,             -- SHA-256 hash. Never store the raw token.
  type            token_type NOT NULL,
  identifier      TEXT NOT NULL,                    -- Email or phone number this token targets.
  expires_at      TIMESTAMPTZ NOT NULL,
  used_at         TIMESTAMPTZ,                      -- Set when consumed. Prevents replay attacks.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_verification_tokens_identifier_type ON verification_tokens (identifier, type);
CREATE INDEX idx_verification_tokens_expires_at ON verification_tokens (expires_at);
