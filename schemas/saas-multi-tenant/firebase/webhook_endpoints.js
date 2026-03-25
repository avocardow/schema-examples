// webhook_endpoints: Registered webhook URLs per organization for event delivery.
// Tracks endpoint health via failure counts and last success/failure timestamps.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const WEBHOOK_ENDPOINT_STATUSES = /** @type {const} */ ({
  ACTIVE:   "active",
  PAUSED:   "paused",
  DISABLED: "disabled",
});

/**
 * Collection: "webhook_endpoints"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - signingSecret is used to compute HMAC signatures for outbound payloads.
 *     Treat it like a password — never expose in client reads.
 *   - url should be validated as a well-formed HTTPS URL before storing.
 *   - organizationId scoping must be enforced in security rules so tenants
 *     can only read/write their own endpoints.
 */

/**
 * @typedef {Object} WebhookEndpointDocument
 * @property {string}         id
 * @property {string}         organizationId  - FK → organizations
 * @property {string}         url             - Target URL for webhook delivery.
 * @property {string|null}    description     - Optional human-readable label.
 * @property {string}         signingSecret   - HMAC secret for payload verification.
 * @property {typeof WEBHOOK_ENDPOINT_STATUSES[keyof typeof WEBHOOK_ENDPOINT_STATUSES]} status
 * @property {number}         failureCount    - Consecutive delivery failures.
 * @property {import("firebase/firestore").Timestamp | null} lastSuccessAt
 * @property {import("firebase/firestore").Timestamp | null} lastFailureAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<WebhookEndpointDocument, "id" | "lastSuccessAt" | "lastFailureAt" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<WebhookEndpointDocument, "id">}
 */
export function createWebhookEndpoint(fields) {
  const now = Timestamp.now();
  return {
    organizationId: fields.organizationId,
    url:            fields.url,
    description:    fields.description    ?? null,
    signingSecret:  fields.signingSecret,
    status:         fields.status         ?? WEBHOOK_ENDPOINT_STATUSES.ACTIVE,
    failureCount:   fields.failureCount   ?? 0,
    lastSuccessAt:  null,
    lastFailureAt:  null,
    createdAt:      now,
    updatedAt:      now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("webhook_endpoints").withConverter(webhookEndpointConverter)
 */
export const webhookEndpointConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId,
      url:            data.url,
      description:    data.description    ?? null,
      signingSecret:  data.signingSecret,
      status:         data.status         ?? WEBHOOK_ENDPOINT_STATUSES.ACTIVE,
      failureCount:   data.failureCount   ?? 0,
      lastSuccessAt:  data.lastSuccessAt  ?? null,  // Timestamp | null
      lastFailureAt:  data.lastFailureAt  ?? null,  // Timestamp | null
      createdAt:      data.createdAt,                // Timestamp
      updatedAt:      data.updatedAt,                // Timestamp
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "webhook_endpoints"
 *   - organizationId ASC, createdAt DESC
 *   - status ASC
 */
