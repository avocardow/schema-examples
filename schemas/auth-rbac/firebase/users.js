// users: Central identity record. One document per human (or anonymous) user.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "users"
 * Document ID: uid (matches Firebase Auth UID)
 *
 * Firestore has no schema DDL, so this file defines the expected document shape
 * as a default factory and a Firestore data converter. Use the converter when
 * reading/writing via the typed SDK (collection(...).withConverter(userConverter)).
 *
 * Security notes:
 *   - privateMetadata must never be returned to the client. Restrict it in
 *     Security Rules: allow read: if request.auth.token.admin == true;
 *   - lastSignInIp storage may be subject to GDPR/CCPA. Review before enabling.
 *   - Soft-deleted documents (deletedAt != null) should be excluded from client
 *     queries via Security Rules or a server-side filter.
 *
 * Subcollections (defined in their own schema files):
 *   users/{uid}/sessions
 *   users/{uid}/mfa_factors
 *   users/{uid}/mfa_challenges
 *   users/{uid}/mfa_recovery_codes
 *   users/{uid}/accounts
 *   users/{uid}/refresh_tokens
 */

/**
 * @typedef {Object} UserDocument
 * @property {string|null}    email                - Always store lowercase. Nullable for anonymous or phone-only users.
 * @property {Timestamp|null} emailVerifiedAt      - When verification happened (not just whether it did).
 * @property {string|null}    phone                - E.164 format (e.g. "+15551234567").
 * @property {Timestamp|null} phoneVerifiedAt
 * @property {string|null}    name                 - Display name. Not used for auth.
 * @property {string|null}    firstName
 * @property {string|null}    lastName
 * @property {string|null}    username
 * @property {string|null}    imageUrl             - Avatar / profile picture URL.
 * @property {boolean}        isAnonymous          - Guest users that can upgrade to full accounts.
 * @property {boolean}        banned               - Admin decision (ToS violation). Can be permanent or temporary.
 * @property {string|null}    bannedReason         - Visible to admins only, never to the user.
 * @property {Timestamp|null} bannedUntil          - null = permanent ban.
 * @property {boolean}        locked               - Automated response (brute-force protection). Always temporary.
 * @property {Timestamp|null} lockedUntil          - Auto-unlock after this time.
 * @property {number}         failedLoginAttempts  - Reset to 0 on successful login. Lock when threshold hit.
 * @property {Timestamp|null} lastFailedLoginAt    - Used with failedLoginAttempts for time-window rate limiting.
 * @property {Object}         publicMetadata       - Client-readable, server-writable (preferences, theme, onboarding).
 * @property {Object}         privateMetadata      - Server-only (Stripe ID, internal notes). Never expose to client.
 * @property {string|null}    externalId           - Link to an external system (legacy DB, CRM).
 * @property {Timestamp|null} lastSignInAt         - Updated on each login. Useful for inactive-user reports.
 * @property {string|null}    lastSignInIp         - Consider privacy regulations before storing.
 * @property {number}         signInCount          - Running total. Useful for analytics and engagement metrics.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 * @property {Timestamp|null} deletedAt            - Soft delete. See README for GDPR/CCPA trade-off discussion.
 */

/**
 * Creates a new UserDocument with defaults applied.
 * @param {Partial<UserDocument>} overrides
 * @returns {UserDocument}
 */
export function createUser(overrides = {}) {
  const now = Timestamp.now();

  return {
    email:               null,       // Always store lowercase. Nullable for anonymous or phone-only users.
    emailVerifiedAt:     null,
    phone:               null,       // E.164 format (e.g. "+15551234567").
    phoneVerifiedAt:     null,
    name:                null,       // Display name. Not used for auth.
    firstName:           null,
    lastName:            null,
    username:            null,
    imageUrl:            null,       // Avatar / profile picture URL.

    isAnonymous:         false,      // Guest users that can upgrade to full accounts.

    // Ban = admin decision (ToS violation). Lock = automated (brute-force protection).
    banned:              false,
    bannedReason:        null,       // Why the user was banned. Visible to admins, not the user.
    bannedUntil:         null,       // null = permanent ban.
    locked:              false,
    lockedUntil:         null,       // Auto-unlock after this time.
    failedLoginAttempts: 0,          // Reset to 0 on successful login. Lock when threshold hit.
    lastFailedLoginAt:   null,

    // Two-tier metadata prevents privilege escalation via client-side manipulation.
    // public:  client-readable, server-writable (preferences, theme, onboarding state).
    // private: server-only (Stripe ID, internal notes). Never expose to client.
    publicMetadata:      {},
    privateMetadata:     {},

    externalId:          null,       // Link to an external system (legacy DB, CRM).
    lastSignInAt:        null,       // Updated on each login.
    lastSignInIp:        null,       // Consider privacy regulations before storing.
    signInCount:         0,

    createdAt:           now,
    updatedAt:           now,

    // Soft delete: keeps document for audit trails, but may conflict with GDPR/CCPA
    // hard-delete requirements. See README for trade-off discussion.
    deletedAt:           null,

    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// Firestore data converter
// Use this with collection("users").withConverter(userConverter) to get typed
// snapshots and automatic Timestamp handling on reads and writes.
// ---------------------------------------------------------------------------

export const userConverter = {
  /**
   * Called by the SDK before writing to Firestore.
   * @param {UserDocument} user
   * @returns {Object} Firestore-serialisable plain object
   */
  toFirestore(user) {
    return { ...user };
  },

  /**
   * Called by the SDK after reading from Firestore.
   * @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot
   * @param {import("firebase/firestore").SnapshotOptions}       options
   * @returns {UserDocument & { id: string }}
   */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);

    return {
      id: snapshot.id,

      email:               data.email               ?? null,
      emailVerifiedAt:     data.emailVerifiedAt     ?? null,       // Timestamp | null
      phone:               data.phone               ?? null,
      phoneVerifiedAt:     data.phoneVerifiedAt     ?? null,       // Timestamp | null
      name:                data.name                ?? null,
      firstName:           data.firstName           ?? null,
      lastName:            data.lastName            ?? null,
      username:            data.username            ?? null,
      imageUrl:            data.imageUrl            ?? null,

      isAnonymous:         data.isAnonymous         ?? false,

      banned:              data.banned              ?? false,
      bannedReason:        data.bannedReason        ?? null,
      bannedUntil:         data.bannedUntil         ?? null,       // Timestamp | null
      locked:              data.locked              ?? false,
      lockedUntil:         data.lockedUntil         ?? null,       // Timestamp | null
      failedLoginAttempts: data.failedLoginAttempts ?? 0,
      lastFailedLoginAt:   data.lastFailedLoginAt   ?? null,       // Timestamp | null

      publicMetadata:      data.publicMetadata      ?? {},
      privateMetadata:     data.privateMetadata     ?? {},         // Server-only. Never expose to client.

      externalId:          data.externalId          ?? null,
      lastSignInAt:        data.lastSignInAt        ?? null,       // Timestamp | null
      lastSignInIp:        data.lastSignInIp        ?? null,
      signInCount:         data.signInCount         ?? 0,

      createdAt:           data.createdAt,                         // Timestamp
      updatedAt:           data.updatedAt,                         // Timestamp
      deletedAt:           data.deletedAt           ?? null,       // Timestamp | null
    };
  },
};
