// webhook_event_types: Registry of event types available for webhook subscriptions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} WebhookEventTypeDocument
 * @property {string}      id
 * @property {string}      key          - Unique machine-readable event key (e.g., "invoice.paid").
 * @property {string}      name         - Human-readable label.
 * @property {string|null} description  - Optional explanation of when this event fires.
 * @property {boolean}     isEnabled    - Whether endpoints can subscribe to this event type.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<WebhookEventTypeDocument, "key" | "name"> & Partial<Pick<WebhookEventTypeDocument, "description" | "isEnabled">>} fields
 * @returns {Omit<WebhookEventTypeDocument, "id">}
 */
export function createWebhookEventType(fields) {
  const now = Timestamp.now();
  return {
    key:         fields.key,
    name:        fields.name,
    description: fields.description ?? null,
    isEnabled:   fields.isEnabled   ?? true,
    createdAt:   now,
    updatedAt:   now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("webhook_event_types").withConverter(webhookEventTypeConverter)
 */
export const webhookEventTypeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      key:         data.key,
      name:        data.name,
      description: data.description ?? null,
      isEnabled:   data.isEnabled,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - webhook_event_types.key        ASC  — Unique lookup by event key.
 *   - webhook_event_types.isEnabled  ASC  — Filter active/inactive event types.
 */
