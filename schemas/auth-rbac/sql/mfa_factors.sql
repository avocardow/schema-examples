-- mfa_factors: Enrolled MFA methods. Each row is one factor (TOTP app, hardware key, phone, etc.).
-- Part of the three-table MFA model: mfa_factors -> mfa_challenges -> mfa_recovery_codes.
-- See README.md for full design rationale and field documentation.

CREATE TYPE mfa_factor_type AS ENUM ('totp', 'webauthn', 'phone', 'email');
CREATE TYPE mfa_factor_status AS ENUM ('unverified', 'verified', 'disabled');

CREATE TABLE mfa_factors (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  factor_type         mfa_factor_type NOT NULL,
  friendly_name       TEXT,                         -- User-assigned label (e.g., "My YubiKey", "Work phone").

  -- unverified = setup in progress. verified = active. disabled = turned off.
  -- Only "verified" factors should be accepted for authentication.
  status              mfa_factor_status NOT NULL DEFAULT 'unverified',

  -- Only one of these is populated, depending on factor_type.
  secret              TEXT,                         -- Encrypted TOTP secret. Must be encrypted at rest (not hashed — you need the value).
  phone               TEXT,                         -- E.164 phone number. For factor_type=phone.
  webauthn_credential JSONB,                        -- WebAuthn public key credential data. For factor_type=webauthn.
  webauthn_aaguid     TEXT,                         -- Authenticator Attestation GUID.

  last_used_at        TIMESTAMPTZ,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_mfa_factors_user_id ON mfa_factors (user_id);
CREATE INDEX idx_mfa_factors_user_id_status ON mfa_factors (user_id, status);
