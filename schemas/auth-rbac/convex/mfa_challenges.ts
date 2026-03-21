// mfa_challenges: In-progress MFA verification attempts. Tracks whether the user
// passed, failed, or timed out.
// See README.md for full design rationale.

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const mfaChallenges = defineTable({
  factorId: v.id("mfa_factors"),
  otpCode: v.optional(v.string()), // Hashed server-generated code (SMS/email factors only).
  webauthnSessionData: v.optional(v.any()), // WebAuthn challenge session data.
  verifiedAt: v.optional(v.number()), // Null = pending. Set on successful verification.
  expiresAt: v.number(), // Short-lived: 5-10 minutes.
  ipAddress: v.optional(v.string()), // Where the challenge was initiated.
})
  .index("by_factor_id", ["factorId"])
  .index("by_expires_at", ["expiresAt"]);
