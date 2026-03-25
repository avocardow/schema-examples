// webhook_endpoint_event_types: Junction collection linking webhook endpoints to event types.
// An endpoint can subscribe to many event types; an event type can belong to many endpoints.
// Simple junction table — no extra fields beyond the FK pair and createdAt.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "webhook_endpoint_event_types"
 * Document ID: Firestore auto-generated or UUID
 *
 * A deterministic document ID (e.g., `${endpointId}_${eventTypeId}`) is recommended to enforce
 * uniqueness on the (endpointId, eventTypeId) pair without a transaction.
 *
 * Security notes:
 *   - When a webhook endpoint is deleted, cascade-delete its webhook_endpoint_event_types documents.
 *   - When an event type is deleted, cascade-delete its webhook_endpoint_event_types documents.
 */

/**
 * @typedef {Object} WebhookEndpointEventTypeDocument
 * @property {string}    id
 * @property {string}    endpointId  - FK → webhook_endpoints
 * @property {string}    eventTypeId - FK → webhook_event_types
 * @property {Timestamp} createdAt
 */

/**
 * Returns a deterministic document ID for a (endpointId, eventTypeId) pair.
 * Use this as the document ID to enforce uniqueness.
 *
 * @param {string} endpointId
 * @param {string} eventTypeId
 * @returns {string}
 */
export function webhookEndpointEventTypeDocId(endpointId, eventTypeId) {
  return `${endpointId}_${eventTypeId}`;
}

/**
 * @param {Omit<WebhookEndpointEventTypeDocument, "id" | "createdAt">} fields
 * @returns {Omit<WebhookEndpointEventTypeDocument, "id">}
 */
export function createWebhookEndpointEventType(fields) {
  return {
    endpointId:  fields.endpointId,
    eventTypeId: fields.eventTypeId,
    createdAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("webhook_endpoint_event_types").withConverter(webhookEndpointEventTypeConverter)
 */
export const webhookEndpointEventTypeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      endpointId:  data.endpointId,
      eventTypeId: data.eventTypeId,
      createdAt:   data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - webhook_endpoint_event_types.endpointId   ASC  — "What event types does this endpoint subscribe to?"
 *   - webhook_endpoint_event_types.eventTypeId   ASC  — "Which endpoints subscribe to this event type?"
 */
