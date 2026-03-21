// saml_providers: Enterprise SSO extension for SAML-based identity providers.
// Extends oauth_providers with SAML-specific details.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const samlProviders = defineTable({
  oauthProviderId: v.id("oauth_providers"), // Parent provider config.
  entityId: v.string(), // SAML EntityID from the IdP.
  metadataXml: v.optional(v.string()), // Full IdP metadata XML.
  metadataUrl: v.optional(v.string()), // URL to fetch IdP metadata (auto-refreshing).
  certificate: v.optional(v.string()), // IdP's X.509 signing certificate.
  nameIdFormat: v.optional(v.string()), // Expected NameID format.
  attributeMapping: v.optional(v.any()), // Maps IdP attribute names to your user fields.
  updatedAt: v.number(),
})
  .index("by_entity_id", ["entityId"])
  .index("by_oauth_provider_id", ["oauthProviderId"]);
