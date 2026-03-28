// subscriptions: User subscriptions to shows with playback preferences.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const NEW_EPISODE_SORT = /** @type {const} */ ({
  NEWEST_FIRST: "newest_first",
  OLDEST_FIRST: "oldest_first",
});

/**
 * @typedef {Object} SubscriptionDocument
 * @property {string} id
 * @property {string} userId - FK → users
 * @property {string} showId - FK → shows
 * @property {boolean} autoDownload
 * @property {boolean} downloadWifiOnly
 * @property {boolean} notificationsEnabled
 * @property {number | null} customPlaybackSpeed
 * @property {typeof NEW_EPISODE_SORT[keyof typeof NEW_EPISODE_SORT]} newEpisodeSort
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<SubscriptionDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<SubscriptionDocument, "id">}
 */
export function createSubscription(fields) {
  return {
    userId: fields.userId,
    showId: fields.showId,
    autoDownload: fields.autoDownload ?? false,
    downloadWifiOnly: fields.downloadWifiOnly ?? true,
    notificationsEnabled: fields.notificationsEnabled ?? true,
    customPlaybackSpeed: fields.customPlaybackSpeed ?? null,
    newEpisodeSort: fields.newEpisodeSort ?? NEW_EPISODE_SORT.NEWEST_FIRST,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const subscriptionConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      userId: data.userId,
      showId: data.showId,
      autoDownload: data.autoDownload,
      downloadWifiOnly: data.downloadWifiOnly,
      notificationsEnabled: data.notificationsEnabled,
      customPlaybackSpeed: data.customPlaybackSpeed ?? null,
      newEpisodeSort: data.newEpisodeSort,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - showId ASC
 *
 * Composite indexes:
 *   - userId ASC, showId ASC
 */
