// sessions: Active login sessions. Tracks *how* the user authenticated, not just *that* they did.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "sessions"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - The raw session token must never appear in this document — only its SHA-256 hash.
 *   - Users may read and delete their own sessions; creation and updates should be server-side only.
 *   - Always check expiresAt server-side; do not rely solely on cookie expiry.
 *   - Cascade-delete sessions when the owning user is deleted.
 */

/**
 * @typedef {"aal1"|"aal2"|"aal3"} AuthAssuranceLevel
 */

export const AAL_LEVELS = /** @type {const} */ ({
  AAL1: "aal1",
  AAL2: "aal2",
  AAL3: "aal3",
});

/**
 * @typedef {Object} SessionDocument
 * @property {string}                userId           - Reference to the owning user. Cascade-delete sessions when the user is deleted.
 * @property {string}                tokenHash        - SHA-256 hash of the session token. Never store raw session tokens.
 * @property {AuthAssuranceLevel}    aal              - aal1 = password/OAuth only. aal2 = MFA verified. aal3 = hardware key verified.
 * @property {string|null}           mfaFactorId      - Which MFA factor elevated this session to aal2+. Null if aal1.
 * @property {string|null}           ipAddress        - Captured at session creation. Useful for security alerts on new logins.
 * @property {string|null}           userAgent        - Browser/device info. Useful for "manage your sessions" UI.
 * @property {string|null}           countryCode      - ISO 3166-1 alpha-2 (2 chars), derived from IP. Null if geo-lookup is not performed.
 * @property {string|null}           organizationId   - Active org context for the session in multi-tenant apps. Null for single-tenant.
 * @property {string|null}           impersonatorId   - Set when an admin is impersonating this user. Show "Exit impersonation" banner when non-null.
 * @property {string|null}           tag              - Custom label (e.g., "mobile", "api", "admin-panel"). Free-form.
 * @property {Timestamp|null}        lastActiveAt     - Updated periodically, not on every request. Useful for "active sessions" UI.
 * @property {Timestamp}             expiresAt        - Hard expiry. Always check server-side; do not rely solely on cookie expiry.
 * @property {Timestamp}             createdAt
 */

/**
 * @param {Omit<SessionDocument, "aal" | "mfaFactorId" | "lastActiveAt" | "createdAt">} fields
 * @returns {Omit<SessionDocument, "id">}
 */
export function createSession(fields) {
  return {
    userId:         fields.userId,
    tokenHash:      fields.tokenHash,
    aal:            "aal1",
    mfaFactorId:    null,
    ipAddress:      fields.ipAddress      ?? null,
    userAgent:      fields.userAgent      ?? null,
    countryCode:    fields.countryCode    ?? null,
    organizationId: fields.organizationId ?? null,
    impersonatorId: fields.impersonatorId ?? null,
    tag:            fields.tag            ?? null,
    lastActiveAt:   null,
    expiresAt:      fields.expiresAt,
    createdAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("sessions").withConverter(sessionConverter)
 */
export const sessionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      userId:         data.userId,
      tokenHash:      data.tokenHash,
      aal:            data.aal             ?? "aal1",
      mfaFactorId:    data.mfaFactorId    ?? null,
      ipAddress:      data.ipAddress       ?? null,
      userAgent:      data.userAgent       ?? null,
      countryCode:    data.countryCode     ?? null,
      organizationId: data.organizationId  ?? null,
      impersonatorId: data.impersonatorId  ?? null,
      tag:            data.tag             ?? null,
      lastActiveAt:   data.lastActiveAt    ?? null,  // Timestamp | null
      expiresAt:      data.expiresAt,                // Timestamp
      createdAt:      data.createdAt,                // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - sessions.userId     ASC  — "Show me all sessions for this user" (session management UI).
 *   - sessions.tokenHash  ASC  — Fast lookup on every authenticated request (unique).
 *   - sessions.expiresAt  ASC  — Cleanup job: delete documents where expiresAt < now().
 */
