// tags: Workspace-scoped labels for categorizing assets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TagDocument
 * @property {string} id
 * @property {string} workspaceId - FK → workspaces
 * @property {string} name
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TagDocument, "id" | "createdAt">} fields
 * @returns {Omit<TagDocument, "id">}
 */
export function createTag(fields) {
  return {
    workspaceId: fields.workspaceId,
    name:        fields.name,
    createdAt:   Timestamp.now(),
  };
}

export const tagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      workspaceId: data.workspaceId,
      name:        data.name,
      createdAt:   data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "tags"
 *   - workspaceId ASC, name ASC
 */
