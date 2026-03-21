// accounts: Unified authentication methods. One row per way a user can sign in.
// Combines OAuth, email+password, magic link, and passkey logins in one table.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const accounts = defineTable({
  userId: v.id("users"),
  provider: v.string(), // e.g., "google", "github", "credential".
  providerAccountId: v.string(), // User's ID at the provider. For "credential", use their email.

  type: v.union(
    v.literal("oauth"),
    v.literal("oidc"),
    v.literal("email"),
    v.literal("credential"),
    v.literal("webauthn"),
  ),

  // Only for credential-type accounts. Never store plaintext passwords.
  passwordHash: v.optional(v.string()),

  // OAuth tokens. Encrypt at rest -- these grant access to the user's external accounts.
  accessToken: v.optional(v.string()),
  refreshToken: v.optional(v.string()), // Provider's refresh token (not your refresh_tokens table).
  idToken: v.optional(v.string()), // OIDC ID token.
  tokenExpiresAt: v.optional(v.number()),
  tokenType: v.optional(v.string()), // Usually "bearer".
  scope: v.optional(v.string()), // OAuth scopes granted (e.g., "openid profile email").

  updatedAt: v.number(),
})
  .index("by_provider_account", ["provider", "providerAccountId"])
  .index("by_user_id", ["userId"]);
