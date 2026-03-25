// canned_responses: reusable reply templates for common ticket scenarios.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CannedResponseDocument
 * @property {string} id
 * @property {string} name
 * @property {string} content
 * @property {string | null} folder
 * @property {string} createdById - FK → users
 * @property {boolean} isShared
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CannedResponseDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CannedResponseDocument, "id">}
 */
export function createCannedResponse(fields) {
  return {
    name: fields.name,
    content: fields.content,
    folder: fields.folder ?? null,
    createdById: fields.createdById,
    isShared: fields.isShared ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const cannedResponseConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      content: data.content,
      folder: data.folder ?? null,
      createdById: data.createdById,
      isShared: data.isShared,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "canned_responses"
 *   - folder ASC
 *   - createdById ASC
 *   - isShared ASC
 */
