// notification_subscriptions: Links users to topics with per-topic, per-channel granularity.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_subscriptions"
 * Document ID: Firestore auto-generated or UUID
 *
 * Composite uniqueness constraint: (userId, topicId, channelType).
 * Firestore does not enforce uniqueness — enforce in application logic or security rules.
 * The nullable channelType (null = all channels) requires the same care as notification_preferences:
 * treat null as a sentinel value when checking for duplicates.
 */

/**
 * @typedef {"email"|"sms"|"push"|"in_app"|"chat"|"webhook"} ChannelType
 */

export const CHANNEL_TYPES = /** @type {const} */ ({
  EMAIL:   "email",
  SMS:     "sms",
  PUSH:    "push",
  IN_APP:  "in_app",
  CHAT:    "chat",
  WEBHOOK: "webhook",
});

/**
 * @typedef {Object} NotificationSubscriptionDocument
 * @property {string}           userId       - Reference to the subscribing user. Cascade-delete when user is deleted.
 * @property {string}           topicId      - Reference to the notification topic. Cascade-delete when topic is deleted.
 * @property {ChannelType|null} channelType  - Which channel this subscription applies to. Null = subscribed on all channels.
 * @property {Timestamp}        createdAt
 */

/**
 * @param {Omit<NotificationSubscriptionDocument, "createdAt">} fields
 * @returns {Omit<NotificationSubscriptionDocument, "id">}
 */
export function createNotificationSubscription(fields) {
  return {
    userId:      fields.userId,
    topicId:     fields.topicId,
    channelType: fields.channelType ?? null,
    createdAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_subscriptions").withConverter(notificationSubscriptionConverter)
 */
export const notificationSubscriptionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      userId:      data.userId,
      topicId:     data.topicId,
      channelType: data.channelType ?? null,
      createdAt:   data.createdAt,              // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_subscriptions.topicId  ASC  — "All subscribers to this topic" (for fan-out).
 *   - notification_subscriptions.userId   ASC  — "All topics this user is subscribed to."
 *
 * Composite:
 *   - (userId, topicId, channelType) — Enforce uniqueness in application logic.
 */
