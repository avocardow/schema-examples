-- accounts: Unified authentication methods. One row per way a user can sign in.
-- Combines OAuth, email+password, magic link, and passkey logins in one table.
-- See README.md for full design rationale and field documentation.

CREATE TYPE account_type AS ENUM ('oauth', 'oidc', 'email', 'credential', 'webauthn');

CREATE TABLE accounts (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider            TEXT NOT NULL,                -- e.g., "google", "github", "credential".
  provider_account_id TEXT NOT NULL,                -- User's ID at the provider. For "credential", use their email.

  -- "credential" = email+password. "email" = passwordless (magic link/OTP).
  -- "webauthn" = passkey as primary login (not MFA — see mfa_factors for that).
  type                account_type NOT NULL,

  -- Only for credential-type accounts. Use bcrypt, scrypt, or argon2id.
  password_hash       TEXT,

  -- OAuth tokens for calling provider APIs on behalf of the user.
  -- Encrypt at rest — these grant access to the user's external accounts.
  access_token        TEXT,
  refresh_token       TEXT,                         -- Provider's refresh token (not your refresh_tokens table).
  id_token            TEXT,                         -- OIDC ID token.
  token_expires_at    TIMESTAMPTZ,
  token_type          TEXT,                         -- Usually "bearer".
  scope               TEXT,                         -- OAuth scopes granted (e.g., "openid profile email").

  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (provider, provider_account_id)
);

CREATE INDEX idx_accounts_user_id ON accounts (user_id);
