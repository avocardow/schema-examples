// lists: curated user lists for organizing followed accounts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ListDocument
 * @property {string} id
 * @property {string} ownerId - FK → users
 * @property {string} name
 * @property {string | null} description
 * @property {boolean} isPrivate
 * @property {number} memberCount
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ListDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ListDocument, "id">}
 */
export function createList(fields) {
  return {
    ownerId: fields.ownerId,
    name: fields.name,
    description: fields.description ?? null,
    isPrivate: fields.isPrivate ?? true,
    memberCount: fields.memberCount ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const listConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ownerId: data.ownerId,
      name: data.name,
      description: data.description ?? null,
      isPrivate: data.isPrivate,
      memberCount: data.memberCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - ownerId   ASC
 *   - isPrivate ASC
 *
 * Composite indexes:
 *   - ownerId ASC, createdAt DESC
 *   - isPrivate ASC, memberCount DESC
 */
