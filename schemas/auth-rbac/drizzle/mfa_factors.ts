// mfa_factors: Enrolled MFA methods. Each row is one factor (TOTP app, hardware key, phone, etc.).
// Part of the three-table MFA model: mfa_factors -> mfa_challenges -> mfa_recovery_codes.
// See README.md for full design rationale.
// Security: the `secret` column (TOTP) MUST be encrypted at rest — you need the original value to verify codes.

import {
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const mfaFactorTypeEnum = pgEnum("mfa_factor_type", [
  "totp",
  "webauthn",
  "phone",
  "email",
]);

export const mfaFactorStatusEnum = pgEnum("mfa_factor_status", [
  "unverified",
  "verified",
  "disabled",
]);

export const mfaFactors = pgTable(
  "mfa_factors",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    factorType: mfaFactorTypeEnum("factor_type").notNull(),
    friendlyName: text("friendly_name"), // User-assigned label (e.g., "My YubiKey", "Work phone").

    // unverified = setup in progress. verified = active. disabled = turned off.
    // Only "verified" factors should be accepted for authentication.
    status: mfaFactorStatusEnum("status").notNull().default("unverified"),

    // Only one of these is populated, depending on factor_type.
    secret: text("secret"),             // Encrypted TOTP secret. Must be encrypted at rest (not hashed — you need the value).
    phone: text("phone"),               // E.164 phone number. For factor_type=phone.
    webauthnCredential: jsonb("webauthn_credential"), // WebAuthn public key credential data. For factor_type=webauthn.
    webauthnAaguid: text("webauthn_aaguid"), // Authenticator Attestation GUID.

    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("idx_mfa_factors_user_id").on(t.userId),               // "Show me all MFA factors for this user."
    index("idx_mfa_factors_user_id_status").on(t.userId, t.status), // "Does this user have any verified factors?" (determines if MFA is enabled).
  ],
);
