// follows: follower-following relationships between users.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FollowDocument
 * @property {string} id
 * @property {string} followerId - FK → users
 * @property {string} followingId - FK → users
 * @property {boolean} notify
 * @property {boolean} showReposts
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<FollowDocument, "id" | "createdAt">} fields
 * @returns {Omit<FollowDocument, "id">}
 */
export function createFollow(fields) {
  return {
    followerId: fields.followerId,
    followingId: fields.followingId,
    notify: fields.notify ?? false,
    showReposts: fields.showReposts ?? true,
    createdAt: Timestamp.now(),
  };
}

export const followConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      followerId: data.followerId,
      followingId: data.followingId,
      notify: data.notify,
      showReposts: data.showReposts,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - followerId  ASC
 *   - followingId ASC
 *
 * Composite indexes:
 *   - followerId ASC, createdAt DESC
 *   - followingId ASC, createdAt DESC
 */
