// notification_threads: Thread-level state for grouping related notifications.
// Provides per-thread read tracking, thread-level metadata, and efficient "threads with unread" queries.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_threads"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - threadKey links a thread to its notification_events (all events with the
 *     same thread_key belong to this thread).
 *   - notificationCount is a counter cache — update it in your app when
 *     notifications are created. Avoids COUNT(*) on every thread list render.
 *   - This table is optional. Lightweight grouping can use the threadKey field
 *     on notification_events directly; this table adds full threading support.
 */

/**
 * @typedef {Object} NotificationThreadDocument
 * @property {string}         id                 - Document ID (from snapshot.id).
 * @property {string}         threadKey          - Unique grouping key, e.g., "issue:456", "pr:789". Must match threadKey on events.
 * @property {string|null}    title              - Display title, e.g., "Fix login bug (#456)". Can be updated as the thread evolves.
 * @property {string|null}    icon               - Icon URL or icon identifier for the thread.
 * @property {string|null}    categoryId         - FK → notification_categories. Optional category for filtering.
 * @property {number}         notificationCount  - Counter cache of notifications in this thread.
 * @property {Timestamp|null} lastActivityAt     - When the most recent event in this thread occurred. For sorting threads.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Omit<NotificationThreadDocument, "id" | "notificationCount" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<NotificationThreadDocument, "id">}
 */
export function createNotificationThread(fields) {
  return {
    threadKey:         fields.threadKey,
    title:             fields.title             ?? null,
    icon:              fields.icon              ?? null,
    categoryId:        fields.categoryId        ?? null,
    notificationCount: 0,
    lastActivityAt:    fields.lastActivityAt    ?? null,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_threads").withConverter(notificationThreadConverter)
 */
export const notificationThreadConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      threadKey:         data.threadKey,
      title:             data.title             ?? null,
      icon:              data.icon              ?? null,
      categoryId:        data.categoryId        ?? null,
      notificationCount: data.notificationCount ?? 0,
      lastActivityAt:    data.lastActivityAt    ?? null,  // Timestamp | null
      createdAt:         data.createdAt,                  // Timestamp
      updatedAt:         data.updatedAt,                  // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Unique (enforced at the application layer or via Security Rules):
 *   - notification_threads.threadKey — unique constraint from pseudo code.
 *
 * Single-field:
 *   - notification_threads.categoryId      ASC  — "All threads in this category."
 *   - notification_threads.lastActivityAt  ASC  — "Threads sorted by most recent activity."
 */
