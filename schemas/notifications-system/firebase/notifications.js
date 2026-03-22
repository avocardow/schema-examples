// notifications: Per-recipient notification record — one document per recipient per event.
// Tracks delivery status (from the provider) and engagement status (from the user) as separate concerns.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notifications"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - This is the "notification" half of the event → notification split.
 *   - recipientType + recipientId form a polymorphic recipient — any entity
 *     with a notification inbox (user, team, organization, etc.).
 *   - deliveryStatus tracks provider hand-off; engagement timestamps (seenAt,
 *     readAt, interactedAt, archivedAt) track user interaction independently.
 *   - Engagement timestamps are nullable and can coexist — a notification can
 *     be seen AND read AND archived simultaneously.
 */

/**
 * @typedef {"pending"|"queued"|"sent"|"delivered"|"failed"|"canceled"} DeliveryStatus
 */

export const DELIVERY_STATUS = /** @type {const} */ ({
  PENDING:   "pending",
  QUEUED:    "queued",
  SENT:      "sent",
  DELIVERED: "delivered",
  FAILED:    "failed",
  CANCELED:  "canceled",
});

/**
 * @typedef {Object} NotificationDocument
 * @property {string}         id              - Document ID (from snapshot.id).
 * @property {string}         eventId         - FK → notification_events. The event that triggered this notification.
 * @property {string}         recipientType   - What kind of entity this notification is for, e.g., "user", "team", "organization".
 * @property {string}         recipientId     - The recipient's ID. Not a FK — recipients can be any entity type.
 * @property {string|null}    reason          - Why this person was notified, e.g., "mention", "assign", "review_requested", "subscription".
 * @property {DeliveryStatus} deliveryStatus  - Lifecycle status of delivery hand-off to a provider.
 * @property {Timestamp|null} seenAt          - When the notification appeared in the user's feed. Null = unseen.
 * @property {Timestamp|null} readAt          - When the user explicitly opened/clicked the notification. Null = unread.
 * @property {Timestamp|null} interactedAt    - When the user performed the notification's primary action. Null = no interaction.
 * @property {Timestamp|null} archivedAt      - Soft archive timestamp. Null = not archived.
 * @property {Timestamp|null} expiresAt       - When this notification becomes stale. Null = never expires.
 * @property {Timestamp}      createdAt       - When the notification was created.
 * @property {Timestamp}      updatedAt       - Last modification time.
 */

/**
 * @param {Omit<NotificationDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<NotificationDocument, "id">}
 */
export function createNotification(fields) {
  return {
    eventId:        fields.eventId,
    recipientType:  fields.recipientType,
    recipientId:    fields.recipientId,
    reason:         fields.reason         ?? null,
    deliveryStatus: fields.deliveryStatus ?? DELIVERY_STATUS.PENDING,
    seenAt:         fields.seenAt         ?? null,
    readAt:         fields.readAt         ?? null,
    interactedAt:   fields.interactedAt   ?? null,
    archivedAt:     fields.archivedAt     ?? null,
    expiresAt:      fields.expiresAt      ?? null,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notifications").withConverter(notificationConverter)
 */
export const notificationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      eventId:        data.eventId,
      recipientType:  data.recipientType,
      recipientId:    data.recipientId,
      reason:         data.reason         ?? null,
      deliveryStatus: data.deliveryStatus,
      seenAt:         data.seenAt         ?? null,
      readAt:         data.readAt         ?? null,
      interactedAt:   data.interactedAt   ?? null,
      archivedAt:     data.archivedAt     ?? null,
      expiresAt:      data.expiresAt      ?? null,
      createdAt:      data.createdAt,              // Timestamp
      updatedAt:      data.updatedAt,              // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notifications.eventId          ASC  — "All notifications for this event" (fan-out query).
 *   - notifications.deliveryStatus   ASC  — "Find all failed notifications for retry."
 *   - notifications.expiresAt        ASC  — Cleanup job: archive or delete expired notifications.
 *
 * Composite:
 *   - notifications.recipientType    ASC
 *     notifications.recipientId      ASC
 *     notifications.readAt           ASC
 *     — "Unread notifications for this user."
 *
 *   - notifications.recipientType    ASC
 *     notifications.recipientId      ASC
 *     notifications.createdAt        ASC
 *     — "Notification feed for this user, newest first."
 *
 *   - notifications.recipientType    ASC
 *     notifications.recipientId      ASC
 *     notifications.seenAt           ASC
 *     — "Unseen count for badge."
 */
