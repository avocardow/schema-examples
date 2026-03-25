// tenant_integrations: Per-tenant connected integration instances with encrypted credentials.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "tenant_integrations"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - (organizationId, integrationId) must be unique — enforce via transaction before writing.
 *   - Deleting an integration_definitions document that is referenced here must be blocked;
 *     check tenant_integrations first.
 *   - Deleting a users document referenced by connectedBy must be blocked;
 *     check tenant_integrations first.
 *   - Deleting an organizations document should cascade-delete its tenant_integrations.
 *   - encryptedCredentials should never be returned to the client; filter in Security Rules
 *     or use a Cloud Function proxy.
 */

/**
 * @typedef {"active"|"inactive"|"error"} TenantIntegrationStatus
 */

export const TENANT_INTEGRATION_STATUSES = /** @type {const} */ ({
  ACTIVE:   "active",
  INACTIVE: "inactive",
  ERROR:    "error",
});

/**
 * @typedef {Object} TenantIntegrationDocument
 * @property {string}                              id
 * @property {string}                              organizationId       - FK → organizations
 * @property {string}                              integrationId        - FK → integration_definitions
 * @property {TenantIntegrationStatus}             status
 * @property {Object|null}                         encryptedCredentials - Encrypted blob; never expose to client.
 * @property {Object|null}                         config
 * @property {string}                              connectedBy          - FK → users
 * @property {import("firebase/firestore").Timestamp|null} lastSyncedAt
 * @property {string|null}                         errorMessage
 * @property {import("firebase/firestore").Timestamp}      createdAt
 * @property {import("firebase/firestore").Timestamp}      updatedAt
 */

/**
 * @param {Omit<TenantIntegrationDocument, "id" | "status" | "encryptedCredentials" | "config" | "lastSyncedAt" | "errorMessage" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TenantIntegrationDocument, "id">}
 */
export function createTenantIntegration(fields) {
  const now = Timestamp.now();
  return {
    organizationId:       fields.organizationId,
    integrationId:        fields.integrationId,
    status:               fields.status               ?? TENANT_INTEGRATION_STATUSES.ACTIVE,
    encryptedCredentials: fields.encryptedCredentials  ?? null,
    config:               fields.config                ?? null,
    connectedBy:          fields.connectedBy,
    lastSyncedAt:         fields.lastSyncedAt          ?? null,
    errorMessage:         fields.errorMessage          ?? null,
    createdAt:            now,
    updatedAt:            now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("tenant_integrations").withConverter(tenantIntegrationConverter)
 */
export const tenantIntegrationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                   snapshot.id,
      organizationId:       data.organizationId,
      integrationId:        data.integrationId,
      status:               data.status               ?? TENANT_INTEGRATION_STATUSES.ACTIVE,
      encryptedCredentials: data.encryptedCredentials  ?? null,
      config:               data.config                ?? null,
      connectedBy:          data.connectedBy,
      lastSyncedAt:         data.lastSyncedAt          ?? null,
      errorMessage:         data.errorMessage          ?? null,
      createdAt:            data.createdAt,
      updatedAt:            data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - tenant_integrations (organizationId ASC, integrationId ASC) UNIQUE — Enforce via transaction before write.
 *
 * Single-field:
 *   - tenant_integrations.integrationId  ASC  — "List all tenants using a given integration."
 *   - tenant_integrations.status         ASC  — "List integrations by status."
 */
