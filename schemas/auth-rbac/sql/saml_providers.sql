-- saml_providers: Enterprise SSO extension for SAML-based identity providers.
-- Extends oauth_providers — SAML is just another SSO strategy.
-- See README.md for full design rationale and field documentation.

CREATE TABLE saml_providers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  oauth_provider_id UUID NOT NULL REFERENCES oauth_providers(id) ON DELETE CASCADE,
  entity_id         TEXT NOT NULL UNIQUE,           -- SAML EntityID from the IdP.
  metadata_xml      TEXT,                           -- Full IdP metadata XML. Either this or metadata_url is required.
  metadata_url      TEXT,                           -- URL to fetch IdP metadata (auto-refreshing). Preferred over static XML.
  certificate       TEXT,                           -- IdP's X.509 signing certificate.
  name_id_format    TEXT,
  attribute_mapping JSONB,                          -- Maps IdP attribute names to your user fields.
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_saml_providers_oauth_provider_id ON saml_providers (oauth_provider_id);
