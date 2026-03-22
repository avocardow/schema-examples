// notification_categories: Classification of notification types for organizing user preferences and routing to feeds.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_categories"
 * Document ID: Firestore auto-generated or UUID
 *
 * Categories serve two purposes: (1) organizing notifications for user preferences
 * ("I want email for billing but not for comments"), and (2) routing notifications to feeds.
 * Every notification event belongs to exactly one category. Categories are defined by
 * the app developer, not by users.
 *
 * Security notes:
 *   - Critical/required categories (isRequired=true) bypass user preferences entirely.
 *   - Users cannot opt out of required categories. Preference evaluation logic must check this.
 */

/**
 * @typedef {Object} NotificationCategoryDocument
 * @property {string}      name          - Display name (e.g., "Comments", "Billing", "Security Alerts").
 * @property {string}      slug          - Identifier used in code and API (e.g., "comments", "billing", "security").
 * @property {string|null} description   - Explain what triggers notifications in this category.
 * @property {string|null} color         - Hex color for UI display (e.g., "#3B82F6").
 * @property {string|null} icon          - Icon identifier or URL for UI display.
 * @property {boolean}     isRequired    - If true, users cannot opt out. Use for security alerts, billing failures, legal notices.
 * @property {string|null} defaultFeedId - Reference to a notification_feeds document. Null = no default feed.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<NotificationCategoryDocument, "name" | "slug"> & Partial<Pick<NotificationCategoryDocument, "description" | "color" | "icon" | "isRequired" | "defaultFeedId">>} fields
 * @returns {Omit<NotificationCategoryDocument, "id">}
 */
export function createNotificationCategory(fields) {
  return {
    name:          fields.name,
    slug:          fields.slug,
    description:   fields.description   ?? null,
    color:         fields.color         ?? null,
    icon:          fields.icon          ?? null,
    isRequired:    fields.isRequired    ?? false,
    defaultFeedId: fields.defaultFeedId ?? null,
    createdAt:     Timestamp.now(),
    updatedAt:     Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_categories").withConverter(notificationCategoryConverter)
 */
export const notificationCategoryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      name:          data.name,
      slug:          data.slug,
      description:   data.description   ?? null,
      color:         data.color         ?? null,
      icon:          data.icon          ?? null,
      isRequired:    data.isRequired    ?? false,
      defaultFeedId: data.defaultFeedId ?? null,
      createdAt:     data.createdAt,    // Timestamp
      updatedAt:     data.updatedAt,    // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_categories.slug        ASC  — Unique lookup by slug (used in code and API).
 *   - notification_categories.isRequired  ASC  — "List all required categories" (grey out toggles in preference UI).
 */
