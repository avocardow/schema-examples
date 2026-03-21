// oauth_clients: OAuth clients for when your app acts as an OAuth server.
// Used by platforms that expose APIs to external developers ("Sign in with YourApp").
// If you only consume OAuth (Google, GitHub), you only need oauth_providers, not this.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "oauth_clients"
 * Document ID: Used as the client_id in OAuth flows (Firestore auto-generated or UUID).
 *
 * Security notes:
 *   - secretHash stores a hashed client secret. Like passwords — never store plaintext.
 *   - redirectUris must be strictly validated during authorization; never allow wildcards.
 *   - "spa" and "native" app types are public clients that must use PKCE; they cannot keep secrets.
 *   - First-party clients (isFirstParty=true) skip the consent screen — use with care.
 */

/**
 * @typedef {Object} OAuthClientDocument
 * @property {string}         name            - Display name shown on the consent screen.
 * @property {string}         secretHash      - Hashed client secret. Never store plaintext.
 * @property {string[]}       redirectUris    - Allowed redirect URIs. Strictly validated during authorization.
 * @property {string[]}       grantTypes      - e.g., ["authorization_code", "client_credentials"].
 * @property {string[]}       scopes          - Allowed scopes this client can request.
 * @property {string|null}    appType         - "web", "spa", "native", or "m2m". Affects security requirements.
 * @property {string|null}    organizationId  - Which org owns this client. Null = platform-level.
 * @property {boolean}        isFirstParty    - First-party clients skip the consent screen.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Omit<OAuthClientDocument, "isFirstParty" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<OAuthClientDocument, "id">}
 */
export function createOAuthClient(fields) {
  const now = Timestamp.now();
  return {
    name:           fields.name,
    secretHash:     fields.secretHash,
    redirectUris:   fields.redirectUris,
    grantTypes:     fields.grantTypes    ?? [],
    scopes:         fields.scopes        ?? [],
    appType:        fields.appType       ?? null,
    organizationId: fields.organizationId ?? null,
    isFirstParty:   false,
    createdAt:      now,
    updatedAt:      now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("oauth_clients").withConverter(oauthClientConverter)
 */
export const oauthClientConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      name:           data.name,
      secretHash:     data.secretHash,
      redirectUris:   data.redirectUris   ?? [],
      grantTypes:     data.grantTypes     ?? [],
      scopes:         data.scopes         ?? [],
      appType:        data.appType        ?? null,
      organizationId: data.organizationId ?? null,
      isFirstParty:   data.isFirstParty   ?? false,
      createdAt:      data.createdAt,                 // Timestamp
      updatedAt:      data.updatedAt,                 // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - oauth_clients.organizationId  ASC  — "List all OAuth clients for this org."
 */
