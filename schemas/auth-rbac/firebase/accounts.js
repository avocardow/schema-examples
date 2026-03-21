// accounts: Unified authentication methods. One document per way a user can sign in.
// Combines OAuth, email+password, magic link, and passkey logins in one collection.
// Collection path: /accounts/{accountId}

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} AccountDocument
 *
 * @property {string}    id                  - Document ID (Firestore auto-generated or UUID).
 * @property {string}    userId              - Reference to the parent user. Index this field.
 * @property {string}    provider            - e.g., "google", "github", "credential". For email+password, use "credential".
 * @property {string}    providerAccountId   - The user's ID at the provider. For "credential", use the user's email.
 *
 * @property {AccountType} type             - Distinguishes login method without parsing the provider string.
 *                                            "credential" = email+password login.
 *                                            "email" = passwordless (magic link / OTP).
 *                                            "oauth" / "oidc" = external provider.
 *                                            "webauthn" = passkey as primary login (not MFA — see mfa_factors for that).
 *
 * @property {string|null}    passwordHash       - Bcrypt, scrypt, or argon2id hash. Credential-type only; null for OAuth.
 *
 * @property {string|null}    accessToken        - OAuth access token. Encrypt at rest — grants access to the user's external account.
 * @property {string|null}    refreshToken       - Provider's refresh token (distinct from your app's refresh_tokens collection). Encrypt at rest.
 * @property {string|null}    idToken            - OIDC ID token containing claims about the user. Encrypt at rest.
 * @property {Timestamp|null} tokenExpiresAt     - When the access token expires.
 * @property {string|null}    tokenType          - Usually "bearer".
 * @property {string|null}    scope              - OAuth scopes granted, e.g., "openid profile email".
 *
 * @property {Timestamp}  createdAt          - When this account link was created.
 * @property {Timestamp}  updatedAt          - Last modified time; update on every write.
 */

/**
 * @type {AccountType}
 * Valid values for the `type` field.
 */
export const ACCOUNT_TYPES = /** @type {const} */ ({
  OAUTH:      "oauth",
  OIDC:       "oidc",
  EMAIL:      "email",
  CREDENTIAL: "credential",
  WEBAUTHN:   "webauthn",
});

/**
 * Returns a plain AccountDocument object suitable for Firestore `setDoc` / `addDoc`.
 * The (provider, providerAccountId) pair must be unique across the collection —
 * enforce this with a Cloud Function or transaction before writing.
 *
 * @param {Omit<AccountDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<AccountDocument, "id">}
 */
export function createAccount(fields) {
  const now = Timestamp.now();
  return {
    userId:            fields.userId,
    provider:          fields.provider,
    providerAccountId: fields.providerAccountId,
    type:              fields.type,
    passwordHash:      fields.passwordHash      ?? null,
    accessToken:       fields.accessToken       ?? null,
    refreshToken:      fields.refreshToken      ?? null,
    idToken:           fields.idToken           ?? null,
    tokenExpiresAt:    fields.tokenExpiresAt     ?? null,
    tokenType:         fields.tokenType         ?? null,
    scope:             fields.scope             ?? null,
    createdAt:         now,
    updatedAt:         now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("accounts").withConverter(accountConverter)
 */
export const accountConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      userId:            data.userId,
      provider:          data.provider,
      providerAccountId: data.providerAccountId,
      type:              data.type,
      passwordHash:      data.passwordHash      ?? null,
      accessToken:       data.accessToken       ?? null,
      refreshToken:      data.refreshToken      ?? null,
      idToken:           data.idToken           ?? null,
      tokenExpiresAt:    data.tokenExpiresAt    ?? null,  // Timestamp | null
      tokenType:         data.tokenType         ?? null,
      scope:             data.scope             ?? null,
      createdAt:         data.createdAt,                  // Timestamp
      updatedAt:         data.updatedAt,                  // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (configure in firestore.indexes.json):
 *
 * Single-field:
 *   - accounts.userId         ASC   — fetch all linked accounts for a user
 *
 * Composite (to enforce uniqueness via query before write):
 *   - accounts.provider       ASC
 *     accounts.providerAccountId ASC
 */
