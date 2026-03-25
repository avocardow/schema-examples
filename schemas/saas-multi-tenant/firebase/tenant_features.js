// tenant_features: Tracks which features are enabled for each organization.
// Links organizations to features with per-tenant overrides for enablement,
// usage limits, and source (plan entitlement, manual override, trial, etc.).
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "tenant_features"
 * Document ID: Firestore auto-generated or UUID
 *
 * A deterministic document ID (e.g., `${organizationId}_${featureId}`) is recommended to enforce
 * uniqueness on the (organizationId, featureId) pair without a transaction.
 *
 * Security notes:
 *   - Only org admins or platform admins should be able to write tenant_features documents.
 *   - Validate that source is a valid TENANT_FEATURE_SOURCES value server-side.
 *   - Check expiresAt server-side when evaluating feature access; do not trust client clocks.
 */

/**
 * @typedef {"plan"|"override"|"trial"|"custom"} TenantFeatureSource
 */

export const TENANT_FEATURE_SOURCES = /** @type {const} */ ({
  PLAN:     "plan",
  OVERRIDE: "override",
  TRIAL:    "trial",
  CUSTOM:   "custom",
});

/**
 * @typedef {Object} TenantFeatureDocument
 * @property {string}         organizationId - FK → organizations. The tenant this feature assignment belongs to.
 * @property {string}         featureId      - FK → features. The feature being granted.
 * @property {boolean}        isEnabled      - Whether the feature is currently active for this tenant.
 * @property {number|null}    limitValue     - Optional numeric cap (e.g., max seats, API calls). Null = unlimited.
 * @property {TenantFeatureSource} source    - How this feature was granted.
 * @property {Timestamp|null} expiresAt      - When access expires. Null = no expiration.
 * @property {string|null}    notes          - Free-text admin notes about this assignment.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * Returns a deterministic document ID for an (organizationId, featureId) pair.
 * Use this as the document ID to enforce uniqueness.
 *
 * @param {string} organizationId
 * @param {string} featureId
 * @returns {string}
 */
export function tenantFeatureDocId(organizationId, featureId) {
  return `${organizationId}_${featureId}`;
}

/**
 * @param {{ organizationId: string; featureId: string; isEnabled?: boolean; limitValue?: number | null; source?: TenantFeatureSource; expiresAt?: Timestamp | null; notes?: string | null }} fields
 * @returns {Omit<TenantFeatureDocument, "id">}
 */
export function createTenantFeature(fields) {
  const now = Timestamp.now();
  return {
    organizationId: fields.organizationId,
    featureId:      fields.featureId,
    isEnabled:      fields.isEnabled  ?? true,
    limitValue:     fields.limitValue ?? null,
    source:         fields.source     ?? TENANT_FEATURE_SOURCES.PLAN,
    expiresAt:      fields.expiresAt  ?? null,
    notes:          fields.notes      ?? null,
    createdAt:      now,
    updatedAt:      now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("tenant_features").withConverter(tenantFeatureConverter)
 */
export const tenantFeatureConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId,
      featureId:      data.featureId,
      isEnabled:      data.isEnabled  ?? true,
      limitValue:     data.limitValue ?? null,
      source:         data.source     ?? TENANT_FEATURE_SOURCES.PLAN,
      expiresAt:      data.expiresAt  ?? null,  // Timestamp | null
      notes:          data.notes      ?? null,
      createdAt:      data.createdAt,            // Timestamp
      updatedAt:      data.updatedAt,            // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - tenant_features.featureId  ASC  — "Which tenants have this feature?"
 *   - tenant_features.source     ASC  — "All features granted via trial."
 *   - tenant_features.expiresAt  ASC  — "Find features expiring soon."
 *
 * Composite:
 *   - tenant_features.organizationId  ASC
 *     tenant_features.featureId       ASC
 *     — Unique pair; enforced via deterministic document ID.
 *
 *   - tenant_features.organizationId  ASC
 *     tenant_features.isEnabled       ASC
 *     — "List all enabled features for a tenant."
 */
