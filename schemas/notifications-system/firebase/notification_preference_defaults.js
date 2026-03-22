// notification_preference_defaults: System-level and tenant-level default preferences for the three-tier hierarchy.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_preference_defaults"
 * Document ID: Firestore auto-generated or UUID
 *
 * Forms the base layers of the three-tier preference hierarchy:
 *   system defaults → tenant defaults → user overrides.
 * Users only need to set preferences where they disagree with the defaults.
 *
 * Uniqueness: At most one default per (scope, scopeId, categoryId, channelType) combination.
 * Enforce uniqueness at the application layer since Firestore has no native unique constraints.
 */

/**
 * @typedef {"system"|"tenant"} PreferenceScope
 */

export const PREFERENCE_SCOPES = /** @type {const} */ ({
  SYSTEM: "system",
  TENANT: "tenant",
});

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
 * @typedef {Object} NotificationPreferenceDefaultDocument
 * @property {PreferenceScope}   scope        - "system" = all users platform-wide. "tenant" = all users within a specific org/tenant.
 * @property {string|null}       scopeId      - The tenant/org ID when scope = "tenant". Null when scope = "system".
 * @property {string|null}       categoryId   - Which notification category this applies to. Null = global default (all categories).
 * @property {ChannelType|null}  channelType  - Which delivery channel this applies to. Null = all channels.
 * @property {boolean}           enabled      - true = opted in by default, false = opted out by default.
 * @property {Timestamp}         createdAt
 * @property {Timestamp}         updatedAt
 */

/**
 * @param {Pick<NotificationPreferenceDefaultDocument, "scope" | "scopeId" | "categoryId" | "channelType" | "enabled">} fields
 * @returns {Omit<NotificationPreferenceDefaultDocument, "id">}
 */
export function createNotificationPreferenceDefault(fields) {
  return {
    scope:       fields.scope,
    scopeId:     fields.scopeId     ?? null,
    categoryId:  fields.categoryId  ?? null,
    channelType: fields.channelType ?? null,
    enabled:     fields.enabled,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_preference_defaults").withConverter(notificationPreferenceDefaultConverter)
 */
export const notificationPreferenceDefaultConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      scope:       data.scope,
      scopeId:     data.scopeId     ?? null,
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
 *   - notification_preference_defaults.scope              ASC  — "All system-level defaults."
 *
 * Composite:
 *   - notification_preference_defaults.scope + scopeId    ASC  — "All defaults for this tenant."
 *
 * Uniqueness:
 *   Enforce unique(scope, scopeId, categoryId, channelType) at the application layer.
 */
