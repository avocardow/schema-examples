// mfa_challenges: In-progress MFA verification attempts. Created when a user is prompted
// for a second factor; tracks pass, fail, or timeout. Enables rate limiting and replay prevention.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "mfa_challenges"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - otpCode stores only the hashed server-generated code (SMS/email factors).
 *     For TOTP the code is time-based so this field is null.
 *   - Expired challenges (expiresAt < now) must be rejected server-side.
 *   - Rate-limit challenge creation per factor to prevent brute force.
 *   - Run a periodic cleanup job to delete documents where expiresAt < now.
 */

/**
 * @typedef {Object} MfaChallengeDocument
 * @property {string}         factorId              - Reference to the mfa_factors document.
 * @property {string|null}    otpCode               - Hashed server-generated code. Null for TOTP (time-based) and WebAuthn.
 * @property {Object|null}    webauthnSessionData   - WebAuthn challenge session data. Null for non-WebAuthn factors.
 * @property {Timestamp|null} verifiedAt            - null = pending. Set when the user successfully verifies.
 * @property {Timestamp}      expiresAt             - Short-lived: 5–10 minutes. Expired challenges must be rejected.
 * @property {string|null}    ipAddress             - Where the challenge was initiated. Useful for fraud detection.
 * @property {Timestamp}      createdAt
 */

/**
 * @param {Omit<MfaChallengeDocument, "verifiedAt" | "createdAt">} fields
 * @returns {Omit<MfaChallengeDocument, "id">}
 */
export function createMfaChallenge(fields) {
  return {
    factorId:            fields.factorId,
    otpCode:             fields.otpCode             ?? null,
    webauthnSessionData: fields.webauthnSessionData ?? null,
    verifiedAt:          null,
    expiresAt:           fields.expiresAt,
    ipAddress:           fields.ipAddress           ?? null,
    createdAt:           Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("mfa_challenges").withConverter(mfaChallengeConverter)
 */
export const mfaChallengeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                  snapshot.id,
      factorId:            data.factorId,
      otpCode:             data.otpCode             ?? null,
      webauthnSessionData: data.webauthnSessionData ?? null,
      verifiedAt:          data.verifiedAt          ?? null, // Timestamp | null
      expiresAt:           data.expiresAt,                   // Timestamp
      ipAddress:           data.ipAddress           ?? null,
      createdAt:           data.createdAt,                   // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - mfa_challenges.factorId   ASC  — "Get active challenges for this factor."
 *   - mfa_challenges.expiresAt  ASC  — Cleanup job: delete expired challenges.
 */
