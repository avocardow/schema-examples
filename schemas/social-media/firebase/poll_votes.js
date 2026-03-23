// poll_votes: individual user votes on poll options.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PollVoteDocument
 * @property {string} id
 * @property {string} pollId - FK → polls
 * @property {string} userId - FK → users
 * @property {number} optionIndex
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<PollVoteDocument, "id" | "createdAt">} fields
 * @returns {Omit<PollVoteDocument, "id">}
 */
export function createPollVote(fields) {
  return {
    pollId: fields.pollId,
    userId: fields.userId,
    optionIndex: fields.optionIndex,
    createdAt: Timestamp.now(),
  };
}

export const pollVoteConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      pollId: data.pollId,
      userId: data.userId,
      optionIndex: data.optionIndex,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - pollId ASC
 *   - userId ASC
 *
 * Composite indexes:
 *   - pollId ASC, userId ASC
 *   - pollId ASC, optionIndex ASC
 */
