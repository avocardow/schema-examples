// workspaces: Top-level organizational unit for digital assets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} WorkspaceDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string|null} logoUrl
 * @property {number|null} storageLimitBytes
 * @property {number} storageUsedBytes
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<WorkspaceDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<WorkspaceDocument, "id">}
 */
export function createWorkspace(fields) {
  return {
    name:              fields.name,
    slug:              fields.slug,
    description:       fields.description ?? null,
    logoUrl:           fields.logoUrl ?? null,
    storageLimitBytes: fields.storageLimitBytes ?? null,
    storageUsedBytes:  fields.storageUsedBytes ?? 0,
    createdBy:         fields.createdBy,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

export const workspaceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      name:              data.name,
      slug:              data.slug,
      description:       data.description ?? null,
      logoUrl:           data.logoUrl ?? null,
      storageLimitBytes: data.storageLimitBytes ?? null,
      storageUsedBytes:  data.storageUsedBytes,
      createdBy:         data.createdBy,
      createdAt:         data.createdAt,
      updatedAt:         data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "workspaces"
 *   - slug ASC
 *   - createdBy ASC
 */
