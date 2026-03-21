// mfa_factors: Enrolled MFA methods. Each row is one factor a user has set up
// (TOTP app, hardware key, phone for SMS, etc.).
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mfaFactors = defineTable({
  userId: v.id("users"),
  factorType: v.union(
    v.literal("totp"),
    v.literal("webauthn"),
    v.literal("phone"),
    v.literal("email"),
  ),
  friendlyName: v.optional(v.string()), // User-assigned label, e.g., "My YubiKey".

  // Lifecycle: unverified -> verified -> disabled.
  status: v.union(
    v.literal("unverified"),
    v.literal("verified"),
    v.literal("disabled"),
  ),

  // Secrets: only one populated depending on factorType.
  secret: v.optional(v.string()), // Encrypted TOTP secret. Must be encrypted at rest.
  phone: v.optional(v.string()), // E.164 phone number. Only for factorType=phone.
  webauthnCredential: v.optional(v.any()), // WebAuthn public key credential data.
  webauthnAaguid: v.optional(v.string()), // Authenticator Attestation GUID.

  lastUsedAt: v.optional(v.number()),
  updatedAt: v.number(),
})
  .index("by_user_id", ["userId"])
  .index("by_user_id_status", ["userId", "status"]);
