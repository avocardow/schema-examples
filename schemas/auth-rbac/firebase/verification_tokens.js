// verification_tokens: Unified one-time tokens for email verification, password reset,
// magic links, phone verification, and platform invitations.
// Org-specific invitations use organization_invitations instead.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "verification_tokens"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - Never store the raw token. Store only the SHA-256 hash.
 *   - Tokens are single-use: set used_at when consumed to prevent replay attacks.
 *   - Expired tokens (expires_at < now) must be rejected server-side.
 *   - Run a periodic cleanup job to delete documents where expires_at < now.
 */

/**
 * @typedef {"email_verification"|"phone_verification"|"password_reset"|"magic_link"|"invitation"} TokenType
 */

export const TOKEN_TYPES = /** @type {const} */ ({
  EMAIL_VERIFICATION: "email_verification",
  PHONE_VERIFICATION: "phone_verification",
  PASSWORD_RESET:     "password_reset",
  MAGIC_LINK:         "magic_link",
  INVITATION:         "invitation", // Platform-level only. Org invitations → organization_invitations.
});

/**
 * @typedef {Object} VerificationTokenDocument
 * @property {string|null}    userId       - Nullable: some tokens exist before a user record (e.g., magic link signup).
 * @property {string}         tokenHash    - SHA-256 hash of the raw token. Never store plaintext.
 * @property {TokenType}      type         - Determines what action to perform when the token is consumed.
 * @property {string}         identifier   - Email or phone number this token targets. Useful for lookup without userId.
 * @property {Timestamp}      expiresAt    - Short-lived: 24h for email, 1h for password reset, 15min for magic link.
 * @property {Timestamp|null} usedAt       - null = unused. Set when consumed to prevent replay attacks.
 * @property {Timestamp}      createdAt
 */

/**
 * @param {Omit<VerificationTokenDocument, "usedAt" | "createdAt">} fields
 * @returns {Omit<VerificationTokenDocument, "id">}
 */
export function createVerificationToken(fields) {
  return {
    userId:     fields.userId     ?? null,
    tokenHash:  fields.tokenHash,
    type:       fields.type,
    identifier: fields.identifier,
    expiresAt:  fields.expiresAt,
    usedAt:     null,
    createdAt:  Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("verification_tokens").withConverter(verificationTokenConverter)
 */
export const verificationTokenConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      userId:     data.userId     ?? null,
      tokenHash:  data.tokenHash,
      type:       data.type,
      identifier: data.identifier,
      expiresAt:  data.expiresAt,            // Timestamp
      usedAt:     data.usedAt     ?? null,   // Timestamp | null
      createdAt:  data.createdAt,            // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - verification_tokens.identifier  ASC
 *     verification_tokens.type        ASC
 *     — "Find the latest password reset token for this email."
 *
 * Single-field:
 *   - verification_tokens.expiresAt   ASC
 *     — Cleanup job: delete expired tokens periodically.
 */
