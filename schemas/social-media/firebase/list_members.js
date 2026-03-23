// list_members: users belonging to a curated list.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ListMemberDocument
 * @property {string} id
 * @property {string} listId - FK → lists
 * @property {string} userId - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ListMemberDocument, "id" | "createdAt">} fields
 * @returns {Omit<ListMemberDocument, "id">}
 */
export function createListMember(fields) {
  return {
    listId: fields.listId,
    userId: fields.userId,
    createdAt: Timestamp.now(),
  };
}

export const listMemberConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      listId: data.listId,
      userId: data.userId,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - listId ASC
 *   - userId ASC
 *
 * Composite indexes:
 *   - listId ASC, userId ASC
 *   - listId ASC, createdAt DESC
 */
