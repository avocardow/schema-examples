// polls: user-created polls with multiple choice options.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} PollDocument
 * @property {string} id
 * @property {string} authorId - FK → users
 * @property {boolean} allowsMultiple
 * @property {string[]} options
 * @property {number} voteCount
 * @property {number} voterCount
 * @property {import("firebase/firestore").Timestamp | null} closesAt
 * @property {boolean} isClosed
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PollDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PollDocument, "id">}
 */
export function createPoll(fields) {
  return {
    authorId: fields.authorId,
    allowsMultiple: fields.allowsMultiple ?? false,
    options: fields.options,
    voteCount: fields.voteCount ?? 0,
    voterCount: fields.voterCount ?? 0,
    closesAt: fields.closesAt ?? null,
    isClosed: fields.isClosed ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const pollConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      authorId: data.authorId,
      allowsMultiple: data.allowsMultiple,
      options: data.options,
      voteCount: data.voteCount,
      voterCount: data.voterCount,
      closesAt: data.closesAt ?? null,
      isClosed: data.isClosed,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - authorId ASC
 *   - isClosed ASC
 *   - closesAt ASC
 *
 * Composite indexes:
 *   - isClosed ASC, closesAt ASC
 *   - authorId ASC, createdAt DESC
 */
