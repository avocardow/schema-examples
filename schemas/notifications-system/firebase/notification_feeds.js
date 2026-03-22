// notification_feeds: Named UI surfaces where notifications can appear (bell icon, activity tab, announcements banner, etc.).
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_feeds"
 * Document ID: Firestore auto-generated or UUID
 *
 * Feeds are orthogonal to categories — a "comment" notification (category) might appear
 * in both the "general" feed (bell icon) and the "activity" feed (activity tab).
 * Users who only need one notification list can ignore this collection entirely.
 */

/**
 * @typedef {Object} NotificationFeedDocument
 * @property {string}      name        - Display name (e.g., "General", "Activity", "Announcements").
 * @property {string}      slug        - URL-safe identifier (e.g., "general", "activity"). Used in API calls: GET /feeds/general.
 * @property {string|null} description - Explain what this feed is for. Shown in admin UI.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<NotificationFeedDocument, "name" | "slug"> & Partial<Pick<NotificationFeedDocument, "description">>} fields
 * @returns {Omit<NotificationFeedDocument, "id">}
 */
export function createNotificationFeed(fields) {
  return {
    name:        fields.name,
    slug:        fields.slug,
    description: fields.description ?? null,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_feeds").withConverter(notificationFeedConverter)
 */
export const notificationFeedConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      name:        data.name,
      slug:        data.slug,
      description: data.description ?? null,
      createdAt:   data.createdAt,   // Timestamp
      updatedAt:   data.updatedAt,   // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_feeds.slug  ASC  — Unique lookup by slug (e.g., GET /feeds/general).
 */
