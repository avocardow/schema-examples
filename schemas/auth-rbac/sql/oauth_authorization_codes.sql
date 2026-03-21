-- oauth_authorization_codes: Short-lived codes for the OAuth authorization code flow.
-- Single-use. Exchanged for tokens within seconds to minutes.
-- See README.md for full design rationale and field documentation.

CREATE TABLE oauth_authorization_codes (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id             UUID NOT NULL REFERENCES oauth_clients(id) ON DELETE CASCADE,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  code_hash             TEXT UNIQUE NOT NULL,       -- Hashed authorization code. Single-use.
  redirect_uri          TEXT NOT NULL,              -- Must exactly match the original authorization request.
  scope                 TEXT,

  -- PKCE: required for public clients (SPAs, mobile apps).
  code_challenge        TEXT,
  code_challenge_method TEXT,                       -- "S256" (recommended) or "plain".

  expires_at            TIMESTAMPTZ NOT NULL,       -- Very short-lived: 30 seconds to 10 minutes.
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_oauth_authorization_codes_expires_at ON oauth_authorization_codes (expires_at);
