// oauth_clients: For when your app acts as an OAuth server (issuing tokens to third-party apps).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const oauthClients = defineTable({
  name: v.string(), // Display name shown in the consent screen.
  secretHash: v.string(), // Hashed client secret. Never store plaintext.
  redirectUris: v.array(v.string()), // Allowed redirect URIs. Strictly validated during authorization.
  grantTypes: v.array(v.string()), // e.g., ["authorization_code", "client_credentials"].
  scopes: v.array(v.string()), // Allowed scopes this client can request.
  appType: v.optional(v.string()), // "web", "spa", "native", or "m2m".

  organizationId: v.optional(v.id("organizations")), // Which org owns this client. Null = platform-level.
  isFirstParty: v.boolean(), // First-party clients skip the consent screen.
  updatedAt: v.number(),
})
  .index("by_organization_id", ["organizationId"]);
