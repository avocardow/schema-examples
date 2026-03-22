// notification_topics: Named pub/sub groups for fan-out delivery.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_topics"
 * Document ID: Firestore auto-generated or UUID
 *
 * Topics are defined by the app developer (e.g., "project:123:updates", "marketing").
 * Different from categories: a category classifies what the notification _is_,
 * a topic determines who _receives_ it.
 */

/**
 * @typedef {Object} NotificationTopicDocument
 * @property {string}        name        - Display name (e.g., "Project Updates", "Marketing Newsletter").
 * @property {string}        slug        - Identifier used in code and API (e.g., "project_updates", "marketing").
 * @property {string|null}   description - Explain what subscribing to this topic means.
 * @property {Timestamp}     createdAt
 * @property {Timestamp}     updatedAt
 */

/**
 * @param {Omit<NotificationTopicDocument, "createdAt" | "updatedAt">} fields
 * @returns {Omit<NotificationTopicDocument, "id">}
 */
export function createNotificationTopic(fields) {
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
 * Usage: collection("notification_topics").withConverter(notificationTopicConverter)
 */
export const notificationTopicConverter = {
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
 *   - notification_topics.slug  ASC  — Unique lookup by slug (enforce uniqueness at app layer).
 */
