// refresh_tokens: Long-lived tokens for obtaining new access tokens without re-authentication.
// Uses a parent_id rotation chain for reuse detection.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const refreshTokens = defineTable({
  sessionId: v.id("sessions"),
  tokenHash: v.string(), // Hashed token. The raw token is sent to the client.

  // Rotation chain: each new token points to the token it replaced.
  // Null = first token in the chain (issued at login).
  parentId: v.optional(v.id("refresh_tokens")),

  revoked: v.boolean(),
  revokedAt: v.optional(v.number()),
  expiresAt: v.number(), // Typically 7-30 days.
})
  .index("by_token_hash", ["tokenHash"])
  .index("by_session_id", ["sessionId"])
  .index("by_parent_id", ["parentId"]);
