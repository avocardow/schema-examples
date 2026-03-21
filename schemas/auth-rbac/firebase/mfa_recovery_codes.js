// mfa_recovery_codes: Backup codes for when a user loses access to their MFA device.
// Generated in a batch (e.g., 10 codes) when MFA is first enabled. Each code is a separate
// document so individual consumption can be tracked.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "mfa_recovery_codes"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - Store only the hash of each code. The plaintext is shown once at generation, never again.
 *   - A used code (usedAt != null) must never be accepted again.
 *   - When MFA is re-enrolled, delete all existing recovery codes and generate a fresh batch.
 *   - Restrict reads to server-side only; clients should only see the count of remaining codes.
 */

/**
 * @typedef {Object} MfaRecoveryCodeDocument
 * @property {string}         userId     - Reference to the owning user.
 * @property {string}         codeHash   - Hashed recovery code. Plaintext is shown once at generation, never stored.
 * @property {Timestamp|null} usedAt     - null = available. Set when consumed. A used code cannot be reused.
 * @property {Timestamp}      createdAt  - When this batch of codes was generated.
 */

/**
 * @param {{ userId: string; codeHash: string }} fields
 * @returns {Omit<MfaRecoveryCodeDocument, "id">}
 */
export function createMfaRecoveryCode(fields) {
  return {
    userId:    fields.userId,
    codeHash:  fields.codeHash,
    usedAt:    null,
    createdAt: Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("mfa_recovery_codes").withConverter(mfaRecoveryCodeConverter)
 */
export const mfaRecoveryCodeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      userId:    data.userId,
      codeHash:  data.codeHash,
      usedAt:    data.usedAt ?? null, // Timestamp | null
      createdAt: data.createdAt,      // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - mfa_recovery_codes.userId  ASC
 *     — "Get all recovery codes for this user" (to check how many are left).
 */
