// mfa_factors: Enrolled MFA methods per user (TOTP, WebAuthn, phone, email).
// A user can have multiple factors. Only "verified" factors are accepted for authentication.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "mfa_factors"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - The TOTP secret must be encrypted at rest — it is needed in plaintext to verify codes.
 *     Use a server-side KMS (e.g., Google Cloud KMS). Do not store unencrypted.
 *   - webauthnCredential contains the public key only; it is safe relative to the secret,
 *     but still restrict client reads to the owning user.
 *   - Only factors with status="verified" should be accepted during authentication.
 *   - Factors with status="disabled" should be excluded from the login flow.
 */

/**
 * @typedef {"totp"|"webauthn"|"phone"|"email"} MfaFactorType
 * @typedef {"unverified"|"verified"|"disabled"} MfaFactorStatus
 */

export const MFA_FACTOR_TYPES = /** @type {const} */ ({
  TOTP:     "totp",
  WEBAUTHN: "webauthn",
  PHONE:    "phone",
  EMAIL:    "email",
});

export const MFA_FACTOR_STATUSES = /** @type {const} */ ({
  UNVERIFIED: "unverified",
  VERIFIED:   "verified",
  DISABLED:   "disabled",
});

/**
 * @typedef {Object} MfaFactorDocument
 * @property {string}            userId               - Reference to the owning user.
 * @property {MfaFactorType}     factorType           - What kind of second factor this is.
 * @property {string|null}       friendlyName         - User-assigned label, e.g., "My YubiKey". Shown in the "manage MFA" UI.
 * @property {MfaFactorStatus}   status               - Lifecycle: unverified → verified → disabled.
 * @property {string|null}       secret               - Encrypted TOTP secret. Populated only for factorType="totp".
 * @property {string|null}       phone                - E.164 phone number. Populated only for factorType="phone".
 * @property {Object|null}       webauthnCredential   - WebAuthn public key credential data. Only for factorType="webauthn".
 * @property {string|null}       webauthnAaguid       - Authenticator Attestation GUID — identifies the authenticator model.
 * @property {Timestamp|null}    lastUsedAt           - Useful for detecting stale/unused factors.
 * @property {Timestamp}         createdAt
 * @property {Timestamp}         updatedAt
 */

/**
 * @param {Omit<MfaFactorDocument, "status" | "lastUsedAt" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<MfaFactorDocument, "id">}
 */
export function createMfaFactor(fields) {
  const now = Timestamp.now();
  return {
    userId:             fields.userId,
    factorType:         fields.factorType,
    friendlyName:       fields.friendlyName       ?? null,
    status:             "unverified",
    secret:             fields.secret             ?? null, // Encrypted TOTP secret. totp only.
    phone:              fields.phone              ?? null, // E.164. phone only.
    webauthnCredential: fields.webauthnCredential ?? null, // webauthn only.
    webauthnAaguid:     fields.webauthnAaguid     ?? null, // webauthn only.
    lastUsedAt:         null,
    createdAt:          now,
    updatedAt:          now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("mfa_factors").withConverter(mfaFactorConverter)
 */
export const mfaFactorConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                 snapshot.id,
      userId:             data.userId,
      factorType:         data.factorType,
      friendlyName:       data.friendlyName       ?? null,
      status:             data.status,
      secret:             data.secret             ?? null,
      phone:              data.phone              ?? null,
      webauthnCredential: data.webauthnCredential ?? null,
      webauthnAaguid:     data.webauthnAaguid     ?? null,
      lastUsedAt:         data.lastUsedAt         ?? null, // Timestamp | null
      createdAt:          data.createdAt,                  // Timestamp
      updatedAt:          data.updatedAt,                  // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - mfa_factors.userId  ASC   — "Show me all MFA factors for this user."
 *
 * Composite:
 *   - mfa_factors.userId  ASC
 *     mfa_factors.status  ASC
 *     — "Does this user have any verified factors?" (determines if MFA is enabled).
 */
