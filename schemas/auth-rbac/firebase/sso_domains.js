// sso_domains: Maps email domains to SSO providers for automatic login routing.
// When a user with @acme.com signs in, look up this collection to route them to Acme's SSO provider.
// Distinct from organization_domains — this routes login traffic; that proves domain ownership.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "sso_domains"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - Only verified domains (verified=true) should trigger SSO routing.
 *     An unverified domain claim could redirect users to an attacker-controlled IdP.
 *   - domain must be globally unique — enforce via transaction before writing.
 *   - Restrict writes to admins only via Security Rules.
 */

/**
 * @typedef {Object} SsoDomainDocument
 * @property {string}         oauthProviderId - Reference to the oauth_providers document.
 * @property {string}         domain          - e.g., "acme.com". One domain can only map to one provider.
 * @property {boolean}        verified        - Has the org proven they own this domain (DNS TXT or email)?
 * @property {Timestamp|null} verifiedAt      - When verification succeeded.
 * @property {Timestamp}      createdAt
 */

/**
 * @param {{ oauthProviderId: string; domain: string }} fields
 * @returns {Omit<SsoDomainDocument, "id">}
 */
export function createSsoDomain(fields) {
  return {
    oauthProviderId: fields.oauthProviderId,
    domain:          fields.domain,
    verified:        false,
    verifiedAt:      null,
    createdAt:       Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("sso_domains").withConverter(ssoDomainConverter)
 */
export const ssoDomainConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      oauthProviderId: data.oauthProviderId,
      domain:          data.domain,
      verified:        data.verified        ?? false,
      verifiedAt:      data.verifiedAt      ?? null,  // Timestamp | null
      createdAt:       data.createdAt,                 // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - sso_domains.domain           ASC  — Must be unique; enforce via transaction before write.
 *   - sso_domains.oauthProviderId  ASC  — "Which domains are claimed by this provider?"
 */
