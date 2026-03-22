// notification_preferences: Per-user opt-in/opt-out controls forming a category × channel matrix.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_preferences"
 * Document ID: Firestore auto-generated or UUID
 *
 * Three-tier preference hierarchy: system defaults → tenant defaults → user overrides.
 * The most specific preference wins: category + channel > category only > global.
 *
 * ⚠️  enabled = false does NOT override is_required categories.
 *     Your preference evaluation logic must check notification_categories.is_required
 *     before consulting this collection.
 *
 * Uniqueness: A user can have at most one preference per (category, channel) combination.
 * Enforce uniqueness at the application layer since Firestore has no native unique constraints.
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
 * @typedef {Object} NotificationPreferenceDocument
 * @property {string}           userId       - Reference to the owning user. Cascade-delete when the user is deleted.
 * @property {string|null}      categoryId   - Which notification category this applies to. Null = global preference (all categories).
 * @property {ChannelType|null} channelType  - Which delivery channel this applies to. Null = all channels.
 * @property {boolean}          enabled      - true = opted in, false = opted out. Does NOT override is_required categories.
 * @property {Timestamp}        createdAt
 * @property {Timestamp}        updatedAt
 */

/**
 * @param {Pick<NotificationPreferenceDocument, "userId" | "categoryId" | "channelType" | "enabled">} fields
 * @returns {Omit<NotificationPreferenceDocument, "id">}
 */
export function createNotificationPreference(fields) {
  return {
    userId:      fields.userId,
    categoryId:  fields.categoryId  ?? null,
    channelType: fields.channelType ?? null,
    enabled:     fields.enabled,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_preferences").withConverter(notificationPreferenceConverter)
 */
export const notificationPreferenceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      userId:      data.userId,
      categoryId:  data.categoryId  ?? null,
      channelType: data.channelType ?? null,
      enabled:     data.enabled,
      createdAt:   data.createdAt,              // Timestamp
      updatedAt:   data.updatedAt,              // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_preferences.userId                  ASC  — "All preferences for this user."
 *
 * Composite:
 *   - notification_preferences.userId + categoryId     ASC  — "User's preferences for this category."
 *
 * Uniqueness:
 *   Enforce unique(userId, categoryId, channelType) at the application layer.
 *   The four valid combinations:
 *     (user, null, null)           = global: "I want/don't want notifications"
 *     (user, category, null)       = category-wide: "I want/don't want billing notifications"
 *     (user, null, channel)        = channel-wide: "I don't want SMS notifications"
 *     (user, category, channel)    = specific: "I want email for billing, but not push"
 */
