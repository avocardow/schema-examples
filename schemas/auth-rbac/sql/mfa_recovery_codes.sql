-- mfa_recovery_codes: Backup codes for when a user loses access to their MFA device.
-- Each code is a separate row for individual consumption tracking.
-- See README.md for full design rationale and field documentation.

CREATE TABLE mfa_recovery_codes (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash       TEXT NOT NULL,                    -- Hashed recovery code. Plaintext shown once at generation, never again.
  used_at         TIMESTAMPTZ,                      -- NULL = available. Set when consumed.
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mfa_recovery_codes_user_id ON mfa_recovery_codes (user_id);
