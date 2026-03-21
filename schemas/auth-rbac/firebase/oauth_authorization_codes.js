// oauth_authorization_codes: Short-lived codes issued during the OAuth authorization code flow.
// The user grants consent; the server issues a code the client exchanges for tokens.
// Single-use, expire in seconds to minutes.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "oauth_authorization_codes"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - codeHash stores only the SHA-256 hash of the raw authorization code.
 *   - Codes are single-use — delete or invalidate the document after exchange.
 *   - redirectUri must exactly match the value from the authorization request.
 *   - PKCE is required for public clients (SPAs, mobile). codeChallenge + codeChallengeMethod
 *     must be validated at token exchange time.
 *   - Run a periodic cleanup job to delete documents where expiresAt < now.
 */

/**
 * @typedef {Object} OAuthAuthorizationCodeDocument
 * @property {string}      clientId              - Reference to the oauth_clients document.
 * @property {string}      userId                - Reference to the user who granted consent.
 * @property {string}      codeHash              - SHA-256 hash of the authorization code. Single-use.
 * @property {string}      redirectUri           - Must exactly match the redirect_uri from the authorization request.
 * @property {string|null} scope                 - Scopes granted by the user.
 * @property {string|null} codeChallenge         - PKCE challenge value from the client. Required for public clients.
 * @property {string|null} codeChallengeMethod   - "S256" (recommended) or "plain" (not recommended).
 * @property {Timestamp}   expiresAt             - Very short-lived: 30 seconds to 10 minutes.
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Omit<OAuthAuthorizationCodeDocument, "createdAt">} fields
 * @returns {Omit<OAuthAuthorizationCodeDocument, "id">}
 */
export function createOAuthAuthorizationCode(fields) {
  return {
    clientId:            fields.clientId,
    userId:              fields.userId,
    codeHash:            fields.codeHash,
    redirectUri:         fields.redirectUri,
    scope:               fields.scope               ?? null,
    codeChallenge:       fields.codeChallenge       ?? null,
    codeChallengeMethod: fields.codeChallengeMethod ?? null,
    expiresAt:           fields.expiresAt,
    createdAt:           Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("oauth_authorization_codes").withConverter(oauthAuthorizationCodeConverter)
 */
export const oauthAuthorizationCodeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                  snapshot.id,
      clientId:            data.clientId,
      userId:              data.userId,
      codeHash:            data.codeHash,
      redirectUri:         data.redirectUri,
      scope:               data.scope               ?? null,
      codeChallenge:       data.codeChallenge       ?? null,
      codeChallengeMethod: data.codeChallengeMethod ?? null,
      expiresAt:           data.expiresAt,                   // Timestamp
      createdAt:           data.createdAt,                   // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - oauth_authorization_codes.codeHash   ASC  — Must be unique; enforce via transaction before write.
 *   - oauth_authorization_codes.expiresAt  ASC  — Cleanup job.
 */
