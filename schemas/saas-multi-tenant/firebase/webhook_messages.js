// webhook_messages: Inbound webhook event records keyed by external event ID.
// Each document captures a single webhook delivery — the raw payload is stored
// as-is so downstream consumers can replay or reprocess events.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "webhook_messages"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Documents are append-only. No updatedAt — if a payload needs correction,
 *     create a new message rather than mutating an existing one.
 *   - payload stores the complete webhook body as a plain Object. Firestore
 *     natively supports nested maps, so no serialization is needed.
 *   - eventId is the external provider's unique event identifier, used for
 *     idempotent processing. Enforce uniqueness at the application layer or
 *     via Security Rules.
 *   - organizationId scopes messages per tenant for multi-tenant isolation.
 */

/**
 * @typedef {Object} WebhookMessageDocument
 * @property {string}    id            - Document ID (from snapshot.id).
 * @property {string}    organizationId - FK → organizations. Scopes messages to a tenant.
 * @property {string}    eventTypeId    - FK → webhook_event_types. Classifies the event.
 * @property {string}    eventId        - External provider's unique event identifier.
 * @property {Object}    payload        - Full webhook request body stored as a Firestore map.
 * @property {Timestamp} createdAt      - When the message was ingested. Immutable.
 */

/**
 * @param {Omit<WebhookMessageDocument, "id" | "createdAt">} fields
 * @returns {Omit<WebhookMessageDocument, "id">}
 */
export function createWebhookMessage(fields) {
  return {
    organizationId: fields.organizationId,
    eventTypeId:    fields.eventTypeId,
    eventId:        fields.eventId,
    payload:        fields.payload,
    createdAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("webhook_messages").withConverter(webhookMessageConverter)
 */
export const webhookMessageConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId,
      eventTypeId:    data.eventTypeId,
      eventId:        data.eventId,
      payload:        data.payload,
      createdAt:      data.createdAt,                // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - webhook_messages.eventTypeId  ASC  — "All messages of this event type."
 *   - webhook_messages.eventId      ASC  — "Look up by external event ID for idempotency."
 *
 * Composite:
 *   - webhook_messages.organizationId  ASC
 *     webhook_messages.createdAt       ASC
 *     — "All messages for this tenant, ordered by ingestion time."
 */
