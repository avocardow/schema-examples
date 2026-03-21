-- oauth_clients: For when your app acts as an OAuth *server* (issuing tokens to third-party apps).
-- Most apps don't need this. Only for platforms with external developer integrations.
-- If you're only consuming OAuth (Google, GitHub), use oauth_providers instead.
-- See README.md for full design rationale and field documentation.

CREATE TABLE oauth_clients (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Also serves as the client_id in OAuth flows.
  name              TEXT NOT NULL,                  -- Shown in the consent screen.
  secret_hash       TEXT NOT NULL,                  -- Hashed client secret. Never store plaintext.
  redirect_uris     TEXT[] NOT NULL,                -- Strictly validated during authorization.
  grant_types       TEXT[] NOT NULL DEFAULT '{}',   -- e.g., '{"authorization_code","client_credentials"}'.
  scopes            TEXT[] NOT NULL DEFAULT '{}',

  -- "web" = server-side (keeps secrets). "spa" = public client (must use PKCE).
  -- "native" = mobile/desktop. "m2m" = machine-to-machine (no user).
  app_type          TEXT,

  organization_id   UUID REFERENCES organizations(id) ON DELETE CASCADE,
  is_first_party    BOOLEAN NOT NULL DEFAULT FALSE, -- First-party clients skip the consent screen.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_oauth_clients_organization_id ON oauth_clients (organization_id) WHERE organization_id IS NOT NULL;
