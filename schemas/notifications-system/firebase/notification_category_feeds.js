// notification_category_feeds: Many-to-many junction between categories and feeds.
// Determines which notification types appear in which UI surfaces.
// See README.md for full design rationale.

/**
 * Collection: "notification_category_feeds"
 * Document ID: Deterministic — `${categoryId}_${feedId}`
 *
 * Firestore has no composite primary key, so uniqueness on (categoryId, feedId) must be
 * enforced via a deterministic document ID.
 * Using a deterministic ID is the recommended approach — it makes idempotent writes trivial.
 *
 * Security notes:
 *   - Restrict writes to admins only via Security Rules.
 *   - When a category is deleted, cascade-delete its notification_category_feeds documents in the same batch.
 *   - When a feed is deleted, cascade-delete its notification_category_feeds documents as well.
 */

/**
 * @typedef {Object} NotificationCategoryFeedDocument
 * @property {string}    categoryId  - Reference to the notification_categories document.
 * @property {string}    feedId      - Reference to the notification_feeds document.
 */

/**
 * Returns a deterministic document ID for a (categoryId, feedId) pair.
 * Use this as the document ID to enforce uniqueness without a transaction.
 *
 * @param {string} categoryId
 * @param {string} feedId
 * @returns {string}
 */
export function notificationCategoryFeedDocId(categoryId, feedId) {
  return `${categoryId}_${feedId}`;
}

/**
 * @param {{ categoryId: string; feedId: string }} fields
 * @returns {Omit<NotificationCategoryFeedDocument, "id">}
 */
export function createNotificationCategoryFeed(fields) {
  return {
    categoryId: fields.categoryId,
    feedId:     fields.feedId,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_category_feeds").withConverter(notificationCategoryFeedConverter)
 */
export const notificationCategoryFeedConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      categoryId: data.categoryId,
      feedId:     data.feedId,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_category_feeds.categoryId  ASC  — "Which feeds does this category appear in?"
 *   - notification_category_feeds.feedId      ASC  — "Which categories appear in this feed?" (reverse lookup).
 */
