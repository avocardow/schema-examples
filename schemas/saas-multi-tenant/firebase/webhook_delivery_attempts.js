// webhook_delivery_attempts: Tracks each attempt to deliver a webhook message to an endpoint.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "webhook_delivery_attempts"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Records every delivery attempt for a webhook message to a specific endpoint.
 *   - Enables retry tracking, latency monitoring, and delivery audit trails.
 *   - Cascade-delete on both messageId and endpointId: remove attempts when the
 *     parent message or endpoint is deleted.
 *   - No updatedAt — attempts are immutable once the outcome is recorded.
 */

/**
 * @typedef {"pending"|"success"|"failed"} WebhookDeliveryStatus
 */

export const WEBHOOK_DELIVERY_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  SUCCESS: "success",
  FAILED:  "failed",
});

/**
 * @typedef {Object} WebhookDeliveryAttemptDocument
 * @property {string}                  id            - Document ID (from snapshot.id).
 * @property {string}                  messageId     - FK → webhook_messages. Cascade-delete.
 * @property {string}                  endpointId    - FK → webhook_endpoints. Cascade-delete.
 * @property {number}                  attemptNumber - Which attempt this is (1 = first try, 2 = first retry, etc.).
 * @property {WebhookDeliveryStatus}   status        - Delivery outcome status.
 * @property {number|null}             httpStatus    - HTTP status code returned by the endpoint.
 * @property {string|null}             responseBody  - Raw response body for debugging.
 * @property {string|null}             errorMessage  - Human-readable error description.
 * @property {Timestamp|null}          attemptedAt   - When the attempt was made.
 * @property {number|null}             durationMs    - Round-trip time in milliseconds.
 * @property {Timestamp|null}          nextRetryAt   - When the next retry is scheduled. Null = no retry planned.
 * @property {Timestamp}               createdAt     - When the record was created.
 */

/**
 * @param {Omit<WebhookDeliveryAttemptDocument, "id" | "createdAt">} fields
 * @returns {Omit<WebhookDeliveryAttemptDocument, "id">}
 */
export function createWebhookDeliveryAttempt(fields) {
  return {
    messageId:     fields.messageId,
    endpointId:    fields.endpointId,
    attemptNumber: fields.attemptNumber ?? 1,
    status:        fields.status        ?? WEBHOOK_DELIVERY_STATUSES.PENDING,
    httpStatus:    fields.httpStatus    ?? null,
    responseBody:  fields.responseBody  ?? null,
    errorMessage:  fields.errorMessage  ?? null,
    attemptedAt:   fields.attemptedAt   ?? null,
    durationMs:    fields.durationMs    ?? null,
    nextRetryAt:   fields.nextRetryAt   ?? null,
    createdAt:     Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("webhook_delivery_attempts").withConverter(webhookDeliveryAttemptConverter)
 */
export const webhookDeliveryAttemptConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      messageId:     data.messageId,
      endpointId:    data.endpointId,
      attemptNumber: data.attemptNumber ?? 1,
      status:        data.status        ?? WEBHOOK_DELIVERY_STATUSES.PENDING,
      httpStatus:    data.httpStatus    ?? null,
      responseBody:  data.responseBody  ?? null,
      errorMessage:  data.errorMessage  ?? null,
      attemptedAt:   data.attemptedAt   ?? null,   // Timestamp | null
      durationMs:    data.durationMs    ?? null,
      nextRetryAt:   data.nextRetryAt   ?? null,   // Timestamp | null
      createdAt:     data.createdAt,                // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - webhook_delivery_attempts.messageId      ASC
 *     webhook_delivery_attempts.attemptNumber   ASC
 *     — "All attempts for a message, ordered by attempt."
 *
 *   - webhook_delivery_attempts.endpointId     ASC
 *     webhook_delivery_attempts.createdAt      ASC
 *     — "Delivery history for an endpoint, chronological."
 *
 *   - webhook_delivery_attempts.status         ASC
 *     webhook_delivery_attempts.nextRetryAt    ASC
 *     — "Find pending retries that are due."
 */
