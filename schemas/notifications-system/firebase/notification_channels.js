// notification_channels: Configured delivery provider instances for each channel type.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_channels"
 * Document ID: Firestore auto-generated or UUID
 *
 * Each document represents a specific provider setup — not an abstract channel type but an actual
 * configured provider like "SendGrid for production email" or "Twilio for SMS." Supports multiple
 * providers per channel type for failover and conditional routing.
 *
 * Security notes:
 *   - The credentials field MUST be encrypted at rest. It contains API keys, auth tokens, and
 *     webhook secrets. Your app decrypts this at delivery time.
 *   - Only one channel per channelType should have isPrimary = true.
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
 * @typedef {Object} NotificationChannelDocument
 * @property {ChannelType}    channelType   - What type of delivery channel this provider serves.
 * @property {string}         provider      - Which third-party provider powers this channel (e.g., "sendgrid", "twilio", "fcm", "slack", "custom").
 * @property {string}         name          - Display name (e.g., "SendGrid Production", "Twilio SMS").
 * @property {Object}         credentials   - Provider credentials. MUST be encrypted at rest. Contains API keys, auth tokens, webhook secrets.
 * @property {boolean}        isActive      - Toggle a provider on/off without deleting its configuration.
 * @property {boolean}        isPrimary     - The default provider for this channel type. Only one per channelType should be primary.
 * @property {number}         priority      - Failover priority: lower number = higher priority.
 * @property {Object|null}    config        - Provider-specific configuration that doesn't fit in credentials.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Omit<NotificationChannelDocument, "createdAt" | "updatedAt"> & Partial<Pick<NotificationChannelDocument, "isActive" | "isPrimary" | "priority" | "config">>} fields
 * @returns {Omit<NotificationChannelDocument, "id">}
 */
export function createNotificationChannel(fields) {
  return {
    channelType:  fields.channelType,
    provider:     fields.provider,
    name:         fields.name,
    credentials:  fields.credentials,
    isActive:     fields.isActive    ?? true,
    isPrimary:    fields.isPrimary   ?? false,
    priority:     fields.priority    ?? 0,
    config:       fields.config      ?? {},
    createdAt:    Timestamp.now(),
    updatedAt:    Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_channels").withConverter(notificationChannelConverter)
 */
export const notificationChannelConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      channelType:  data.channelType,
      provider:     data.provider,
      name:         data.name,
      credentials:  data.credentials,
      isActive:     data.isActive     ?? true,
      isPrimary:    data.isPrimary    ?? false,
      priority:     data.priority     ?? 0,
      config:       data.config       ?? {},
      createdAt:    data.createdAt,               // Timestamp
      updatedAt:    data.updatedAt,               // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - notification_channels.channelType + isActive    ASC  — "All active email providers" (for delivery routing).
 *   - notification_channels.channelType + isPrimary   ASC  — "Which provider is the default for email?"
 *   - notification_channels.channelType + priority    ASC  — "Failover order for this channel type."
 */
