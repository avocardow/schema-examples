// notification_delivery_attempts: Per-notification, per-channel delivery attempt log.
// Every time the system tries to deliver a notification through a channel, a row is created here.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_delivery_attempts"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Enables full delivery audit trails, retry tracking, and provider response logging.
 *   - Status progresses forward through the delivery lifecycle (pending → queued → sent → delivered).
 *   - providerMessageId is used to match incoming webhooks (delivery receipts, bounces, complaints)
 *     back to this delivery attempt.
 *   - Restrict-delete on channelId: don't delete a channel that has delivery history.
 */

/**
 * @typedef {"pending"|"queued"|"sent"|"delivered"|"bounced"|"failed"} DeliveryAttemptStatus
 */

export const DELIVERY_ATTEMPT_STATUSES = /** @type {const} */ ({
  PENDING:   "pending",
  QUEUED:    "queued",
  SENT:      "sent",
  DELIVERED: "delivered",
  BOUNCED:   "bounced",
  FAILED:    "failed",
});

/**
 * @typedef {Object} NotificationDeliveryAttemptDocument
 * @property {string}                id                - Document ID (from snapshot.id).
 * @property {string}                notificationId    - FK → notifications. Cascade-delete when the notification is deleted.
 * @property {string}                channelId         - FK → notification_channels. Restrict-delete: don't delete a channel with delivery history.
 * @property {DeliveryAttemptStatus} status            - Delivery lifecycle status. Mutually exclusive, progresses forward.
 * @property {string|null}           providerMessageId - Provider's message ID for matching incoming webhooks.
 * @property {Object|null}           providerResponse  - Raw provider response for debugging delivery issues.
 * @property {string|null}           errorCode         - Provider-specific error code (e.g., "550", "InvalidRegistration").
 * @property {string|null}           errorMessage      - Human-readable error description.
 * @property {number}                attemptNumber     - Which attempt this is (1 = first try, 2 = first retry, etc.).
 * @property {Timestamp|null}        nextRetryAt       - When the next retry is scheduled. Null = no retry planned.
 * @property {Timestamp|null}        sentAt            - When the provider accepted the request.
 * @property {Timestamp|null}        deliveredAt       - When delivery was confirmed (from provider webhook).
 * @property {Timestamp}             createdAt         - When the attempt was created.
 * @property {Timestamp}             updatedAt         - Tracks the latest status transition.
 */

/**
 * @param {Omit<NotificationDeliveryAttemptDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<NotificationDeliveryAttemptDocument, "id">}
 */
export function createNotificationDeliveryAttempt(fields) {
  return {
    notificationId:    fields.notificationId,
    channelId:         fields.channelId,
    status:            fields.status            ?? DELIVERY_ATTEMPT_STATUSES.PENDING,
    providerMessageId: fields.providerMessageId ?? null,
    providerResponse:  fields.providerResponse  ?? null,
    errorCode:         fields.errorCode         ?? null,
    errorMessage:      fields.errorMessage      ?? null,
    attemptNumber:     fields.attemptNumber     ?? 1,
    nextRetryAt:       fields.nextRetryAt       ?? null,
    sentAt:            fields.sentAt            ?? null,
    deliveredAt:       fields.deliveredAt       ?? null,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_delivery_attempts").withConverter(notificationDeliveryAttemptConverter)
 */
export const notificationDeliveryAttemptConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      notificationId:    data.notificationId,
      channelId:         data.channelId,
      status:            data.status            ?? DELIVERY_ATTEMPT_STATUSES.PENDING,
      providerMessageId: data.providerMessageId ?? null,
      providerResponse:  data.providerResponse  ?? null,
      errorCode:         data.errorCode         ?? null,
      errorMessage:      data.errorMessage      ?? null,
      attemptNumber:     data.attemptNumber     ?? 1,
      nextRetryAt:       data.nextRetryAt       ?? null,  // Timestamp | null
      sentAt:            data.sentAt            ?? null,  // Timestamp | null
      deliveredAt:       data.deliveredAt       ?? null,  // Timestamp | null
      createdAt:         data.createdAt,                  // Timestamp
      updatedAt:         data.updatedAt,                  // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_delivery_attempts.notificationId     ASC  — "All delivery attempts for this notification."
 *   - notification_delivery_attempts.providerMessageId  ASC  — "Match incoming webhook to delivery attempt."
 *   - notification_delivery_attempts.createdAt          ASC  — Time-range queries and retention cleanup.
 *
 * Composite:
 *   - notification_delivery_attempts.channelId          ASC
 *     notification_delivery_attempts.status             ASC
 *     — "All failed deliveries for this channel" (provider health monitoring).
 *
 *   - notification_delivery_attempts.status             ASC
 *     notification_delivery_attempts.nextRetryAt        ASC
 *     — "Find pending retries that are due."
 */
