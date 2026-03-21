// mfa_challenges: In-progress MFA verification attempts.
// Enables rate limiting and replay prevention for second-factor verification.
// See README.md for full design rationale.

import { index, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { mfaFactors } from "./mfa_factors";

export const mfaChallenges = pgTable(
  "mfa_challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    factorId: uuid("factor_id")
      .notNull()
      .references(() => mfaFactors.id, { onDelete: "cascade" }),

    // Hashed server-generated code (SMS/email factors only). NULL for TOTP.
    otpCode: text("otp_code"),
    // WebAuthn challenge session data. NULL for non-WebAuthn factors.
    webauthnSessionData: jsonb("webauthn_session_data"),

    // NULL = pending. Set when the user successfully verifies.
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    // Short-lived: 5–10 minutes. Expired challenges must be rejected.
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    // Where the challenge was initiated. Useful for fraud detection.
    ipAddress: text("ip_address"),

    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    // "Get active challenges for this factor."
    index("idx_mfa_challenges_factor_id").on(table.factorId),
    // Cleanup job: delete expired challenges.
    index("idx_mfa_challenges_expires_at").on(table.expiresAt),
  ],
);
