// oauth_providers: Configuration for external OAuth/SSO providers your app authenticates against.
// This is the "consuming" side — your app is the relying party.
// Not to be confused with oauth_clients, which is for when your app acts as an OAuth server.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "oauth_providers"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - clientSecret MUST be encrypted at rest. Use Google Cloud Secret Manager or KMS.
 *     Never store plaintext secrets in Firestore documents.
 *   - Restrict writes to admins only via Security Rules.
 *   - Disabled providers (enabled=false) should be excluded from the login page at runtime.
 */

/**
 * @typedef {Object} OAuthProviderDocument
 * @property {string}         name            - Display name shown in the UI (e.g., "Google", "Acme Corp SSO").
 * @property {string}         slug            - URL-safe identifier (e.g., "google", "acme-sso"). Used in code and callback URLs.
 * @property {string}         strategy        - "oauth2", "oidc", or "saml". Determines which flow to use.
 * @property {string}         clientId        - OAuth client ID from the provider's developer console.
 * @property {string|null}    clientSecret    - Encrypted at rest. Null for public clients (mobile/SPA using PKCE without a secret).
 * @property {string|null}    authorizationUrl - Override for custom/self-hosted providers. Null = use well-known defaults.
 * @property {string|null}    tokenUrl        - Override for custom providers.
 * @property {string|null}    userinfoUrl     - Override for custom providers.
 * @property {string[]}       scopes          - Default scopes to request (e.g., ["openid", "profile", "email"]).
 * @property {boolean}        enabled         - Toggle a provider on/off without deleting its configuration.
 * @property {string|null}    organizationId  - Org-scoped SSO: only available to members of this org. Null = available to all users.
 * @property {Object|null}    metadata        - Provider-specific config that doesn't fit standard fields.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Omit<OAuthProviderDocument, "enabled" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<OAuthProviderDocument, "id">}
 */
export function createOAuthProvider(fields) {
  const now = Timestamp.now();
  return {
    name:             fields.name,
    slug:             fields.slug,
    strategy:         fields.strategy,
    clientId:         fields.clientId,
    clientSecret:     fields.clientSecret     ?? null,
    authorizationUrl: fields.authorizationUrl ?? null,
    tokenUrl:         fields.tokenUrl         ?? null,
    userinfoUrl:      fields.userinfoUrl       ?? null,
    scopes:           fields.scopes           ?? [],
    enabled:          true,
    organizationId:   fields.organizationId   ?? null,
    metadata:         fields.metadata         ?? null,
    createdAt:        now,
    updatedAt:        now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("oauth_providers").withConverter(oauthProviderConverter)
 */
export const oauthProviderConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      name:             data.name,
      slug:             data.slug,
      strategy:         data.strategy,
      clientId:         data.clientId,
      clientSecret:     data.clientSecret     ?? null,
      authorizationUrl: data.authorizationUrl ?? null,
      tokenUrl:         data.tokenUrl         ?? null,
      userinfoUrl:      data.userinfoUrl       ?? null,
      scopes:           data.scopes           ?? [],
      enabled:          data.enabled          ?? true,
      organizationId:   data.organizationId   ?? null,
      metadata:         data.metadata         ?? null,
      createdAt:        data.createdAt,                  // Timestamp
      updatedAt:        data.updatedAt,                  // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - oauth_providers.slug            ASC  — Direct lookup by slug (must be unique; enforce via transaction).
 *   - oauth_providers.organizationId  ASC  — "Which SSO providers does this org have?"
 *   - oauth_providers.enabled         ASC  — "List all active providers for the login page."
 */
