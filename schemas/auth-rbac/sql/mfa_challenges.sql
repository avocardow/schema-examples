-- mfa_challenges: In-progress MFA verification attempts.
-- Enables rate limiting and replay prevention for second-factor verification.
-- See README.md for full design rationale and field documentation.

CREATE TABLE mfa_challenges (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  factor_id             UUID NOT NULL REFERENCES mfa_factors(id) ON DELETE CASCADE,
  otp_code              TEXT,                       -- Hashed server-generated code (SMS/email factors only). NULL for TOTP.
  webauthn_session_data JSONB,                      -- WebAuthn challenge session data. NULL for non-WebAuthn factors.
  verified_at           TIMESTAMPTZ,                -- NULL = pending. Set when the user successfully verifies.
  expires_at            TIMESTAMPTZ NOT NULL,        -- Short-lived: 5-10 minutes.
  ip_address            TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mfa_challenges_factor_id ON mfa_challenges (factor_id);
CREATE INDEX idx_mfa_challenges_expires_at ON mfa_challenges (expires_at);
