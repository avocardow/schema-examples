// organization_domains: Verified domains owned by an organization.
// Used for auto-join (users with @acme.com are added to Acme's org) and branding.
// Distinct from sso_domains — this proves ownership; that routes login traffic.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "organization_domains"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - Only verified domains (verified=true) should trigger auto-join or SSO routing.
 *     An unverified domain claim allows any org to hijack another's users.
 *   - domain must be globally unique — enforce via transaction before writing.
 *   - verificationToken is the secret value the org sets in DNS or confirms via email.
 *     It can be cleared after verification succeeds to avoid unnecessary exposure.
 */

/**
 * @typedef {Object} OrganizationDomainDocument
 * @property {string}         organizationId       - Reference to the organizations document.
 * @property {string}         domain               - e.g., "acme.com". Lowercase, no protocol prefix.
 * @property {boolean}        verified             - Only verified domains should trigger auto-join or SSO routing.
 * @property {string|null}    verificationMethod   - "dns" (TXT record), "email" (admin@domain), etc.
 * @property {string|null}    verificationToken    - The token/value the org must set in DNS or confirm via email.
 * @property {Timestamp|null} verifiedAt           - When verification succeeded.
 * @property {Timestamp}      createdAt
 */

/**
 * @param {Omit<OrganizationDomainDocument, "verified" | "verifiedAt" | "createdAt">} fields
 * @returns {Omit<OrganizationDomainDocument, "id">}
 */
export function createOrganizationDomain(fields) {
  return {
    organizationId:     fields.organizationId,
    domain:             fields.domain,
    verified:           false,
    verificationMethod: fields.verificationMethod ?? null,
    verificationToken:  fields.verificationToken  ?? null,
    verifiedAt:         null,
    createdAt:          Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("organization_domains").withConverter(organizationDomainConverter)
 */
export const organizationDomainConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                 snapshot.id,
      organizationId:     data.organizationId,
      domain:             data.domain,
      verified:           data.verified           ?? false,
      verificationMethod: data.verificationMethod ?? null,
      verificationToken:  data.verificationToken  ?? null,
      verifiedAt:         data.verifiedAt         ?? null, // Timestamp | null
      createdAt:          data.createdAt,                   // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - organization_domains.domain          ASC  — Must be unique; enforce via transaction before write.
 *   - organization_domains.organizationId  ASC  — "Which domains does this org own?"
 */
