// organizations: Top-level tenant/workspace grouping for multi-tenant apps.
// Users belong to organizations through organization_members. Each org can have verified
// domains, teams, and its own SSO configuration.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "organizations"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - private_metadata must never be returned to clients. Restrict via Security Rules.
 *   - slug must be globally unique — enforce via transaction before writing.
 *   - Soft-deleted organizations (deletedAt != null) should be excluded from client queries.
 *   - stripeCustomerId is sensitive billing data; restrict reads to server-side / admin only.
 */

/**
 * @typedef {Object} OrganizationDocument
 * @property {string}         name              - Display name (e.g., "Acme Corporation").
 * @property {string}         slug              - URL-safe identifier (e.g., "acme-corp"). Used in URLs: /orgs/acme-corp.
 * @property {string|null}    logoUrl           - Organization logo for branding.
 * @property {string|null}    externalId        - Your own cross-system reference.
 * @property {string|null}    stripeCustomerId  - Direct Stripe link. Restrict access to server-side.
 * @property {number|null}    maxMembers        - Plan-based member limit. Null = unlimited. Enforced in app logic.
 * @property {Object}         publicMetadata    - Client-readable, server-writable (preferences, branding, onboarding).
 * @property {Object}         privateMetadata   - Server-only (billing notes, feature flags). Never expose to client.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 * @property {Timestamp|null} deletedAt         - Soft delete. Same GDPR considerations as users.
 */

/**
 * @param {Omit<OrganizationDocument, "publicMetadata" | "privateMetadata" | "createdAt" | "updatedAt" | "deletedAt">} fields
 * @returns {Omit<OrganizationDocument, "id">}
 */
export function createOrganization(fields) {
  const now = Timestamp.now();
  return {
    name:             fields.name,
    slug:             fields.slug,
    logoUrl:          fields.logoUrl          ?? null,
    externalId:       fields.externalId       ?? null,
    stripeCustomerId: fields.stripeCustomerId ?? null,
    maxMembers:       fields.maxMembers       ?? null,
    publicMetadata:   {},
    privateMetadata:  {},
    createdAt:        now,
    updatedAt:        now,
    deletedAt:        null,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("organizations").withConverter(organizationConverter)
 */
export const organizationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      name:             data.name,
      slug:             data.slug,
      logoUrl:          data.logoUrl          ?? null,
      externalId:       data.externalId       ?? null,
      stripeCustomerId: data.stripeCustomerId ?? null,
      maxMembers:       data.maxMembers       ?? null,
      publicMetadata:   data.publicMetadata   ?? {},
      privateMetadata:  data.privateMetadata  ?? {},  // Server-only. Never expose to client.
      createdAt:        data.createdAt,                // Timestamp
      updatedAt:        data.updatedAt,                // Timestamp
      deletedAt:        data.deletedAt        ?? null, // Timestamp | null
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - organizations.slug              ASC  — Must be unique; enforce via transaction before write.
 *   - organizations.externalId        ASC  — Must be unique when set; enforce server-side.
 *   - organizations.stripeCustomerId  ASC  — Must be unique when set; enforce server-side.
 */
