-- oauth_providers: External OAuth/SSO provider configuration (Google, GitHub, corporate SAML, etc.).
-- This is the "consuming" side — your app is the relying party.
-- For when your app *acts as* an OAuth server, see oauth_clients instead.
-- See README.md for full design rationale and field documentation.

CREATE TABLE oauth_providers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,                  -- Display name (e.g., "Google", "Acme Corp SSO").
  slug              TEXT UNIQUE NOT NULL,           -- URL-safe identifier. Used in callback URLs (e.g., /auth/callback/google).
  strategy          TEXT NOT NULL,                  -- "oauth2", "oidc", or "saml".
  client_id         TEXT NOT NULL,
  client_secret     TEXT,                           -- Encrypt at rest. Nullable for public clients (mobile/SPA using PKCE).
  authorization_url TEXT,                           -- Override for custom/self-hosted providers.
  token_url         TEXT,
  userinfo_url      TEXT,
  scopes            TEXT[] NOT NULL DEFAULT '{}',   -- Default scopes to request (e.g., '{"openid","profile","email"}').
  enabled           BOOLEAN NOT NULL DEFAULT TRUE,
  organization_id   UUID REFERENCES organizations(id) ON DELETE CASCADE, -- NULL = available to all users.
  metadata          JSONB,                          -- Provider-specific config.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_oauth_providers_organization_id ON oauth_providers (organization_id) WHERE organization_id IS NOT NULL;
CREATE INDEX idx_oauth_providers_enabled ON oauth_providers (enabled) WHERE enabled = TRUE;
