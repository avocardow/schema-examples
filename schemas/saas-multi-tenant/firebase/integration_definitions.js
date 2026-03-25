// integration_definitions: Catalog of available third-party integrations.
// Each record describes one integration type (e.g., Slack, Stripe) with its
// authentication method, optional config schema, and display metadata.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Allowed values for the `authMethod` field.
 */
export const INTEGRATION_AUTH_METHODS = /** @type {const} */ ({
  OAUTH2:  "oauth2",
  API_KEY: "api_key",
  WEBHOOK: "webhook",
  NONE:    "none",
});

/**
 * Collection: "integration_definitions"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - `key` must be unique — enforce via transaction before writing.
 *   - `configSchema` is arbitrary JSON; validate before interpreting.
 */

/**
 * @typedef {Object} IntegrationDefinitionDocument
 * @property {string}      id
 * @property {string}      key          - Machine-readable identifier (unique).
 * @property {string}      name         - Human-readable display name.
 * @property {string|null} description  - Optional long description.
 * @property {string|null} iconUrl      - URL to the integration's icon.
 * @property {string}      authMethod   - One of INTEGRATION_AUTH_METHODS values.
 * @property {Object|null} configSchema - JSON schema describing required config fields.
 * @property {boolean}     isEnabled    - Whether this integration is available to tenants.
 * @property {number}      sortOrder    - Display ordering weight.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Omit<IntegrationDefinitionDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<IntegrationDefinitionDocument, "id">}
 */
export function createIntegrationDefinition(fields) {
  const now = Timestamp.now();
  return {
    key:          fields.key,
    name:         fields.name,
    description:  fields.description  ?? null,
    iconUrl:      fields.iconUrl      ?? null,
    authMethod:   fields.authMethod,
    configSchema: fields.configSchema ?? null,
    isEnabled:    fields.isEnabled    ?? true,
    sortOrder:    fields.sortOrder    ?? 0,
    createdAt:    now,
    updatedAt:    now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("integration_definitions").withConverter(integrationDefinitionConverter)
 */
export const integrationDefinitionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      key:          data.key,
      name:         data.name,
      description:  data.description  ?? null,
      iconUrl:      data.iconUrl      ?? null,
      authMethod:   data.authMethod,
      configSchema: data.configSchema ?? null,
      isEnabled:    data.isEnabled    ?? true,
      sortOrder:    data.sortOrder    ?? 0,
      createdAt:    data.createdAt,
      updatedAt:    data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - integration_definitions.key        ASC  — Must be unique; enforce via transaction before write.
 *   - integration_definitions.isEnabled  ASC  — Filter by active integrations.
 */
