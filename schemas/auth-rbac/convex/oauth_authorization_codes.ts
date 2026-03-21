// oauth_authorization_codes: Short-lived codes issued during the OAuth authorization code flow.
// Single-use and expire in seconds to minutes.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const oauthAuthorizationCodes = defineTable({
  clientId: v.id("oauth_clients"),
  userId: v.id("users"),
  codeHash: v.string(), // Hashed authorization code. Single-use.
  redirectUri: v.string(), // Must exactly match the redirect_uri from the authorization request.
  scope: v.optional(v.string()), // Scopes granted by the user.

  // PKCE: required for public clients (SPAs, mobile apps).
  codeChallenge: v.optional(v.string()),
  codeChallengeMethod: v.optional(v.string()), // "S256" (recommended) or "plain".

  expiresAt: v.number(), // Very short-lived: 30 seconds to 10 minutes.
})
  .index("by_code_hash", ["codeHash"])
  .index("by_expires_at", ["expiresAt"]);
