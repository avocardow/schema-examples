// oauth_providers: Configuration for external OAuth/SSO providers your app authenticates against.
// This is the "consuming" side -- your app is the relying party.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const oauthProviders = defineTable({
  name: v.string(), // Display name (e.g., "Google", "Acme Corp SSO").
  slug: v.string(), // URL-safe identifier (e.g., "google", "github"). Used in callback URLs.
  strategy: v.string(), // "oauth2", "oidc", or "saml".
  clientId: v.string(), // OAuth client ID from the provider's developer console.
  clientSecret: v.optional(v.string()), // Encrypt at rest. Nullable for public clients using PKCE.
  authorizationUrl: v.optional(v.string()), // Override for custom/self-hosted providers.
  tokenUrl: v.optional(v.string()),
  userinfoUrl: v.optional(v.string()),
  scopes: v.array(v.string()), // Default scopes to request.
  enabled: v.boolean(), // Toggle on/off without deleting configuration.

  organizationId: v.optional(v.id("organizations")), // Org-scoped SSO. Null = available to all users.

  metadata: v.optional(v.any()), // Provider-specific config.
  updatedAt: v.number(),
})
  .index("by_slug", ["slug"])
  .index("by_organization_id", ["organizationId"])
  .index("by_enabled", ["enabled"]);
