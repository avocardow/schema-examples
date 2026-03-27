// poll_responses: individual user answers to meeting polls.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PollResponseDocument
 * @property {string} id
 * @property {string} pollId - FK → meeting_polls
 * @property {string} userId - FK → users
 * @property {Array} selectedOptions
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createPollResponse(fields) {
  return {
    pollId: fields.pollId,
    userId: fields.userId,
    selectedOptions: fields.selectedOptions,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const pollResponseConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      pollId: data.pollId,
      userId: data.userId,
      selectedOptions: data.selectedOptions,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - poll_responses: pollId ASC, createdAt ASC
 *   - poll_responses: userId ASC, createdAt DESC
 */
