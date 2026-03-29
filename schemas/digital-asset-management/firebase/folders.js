// folders: Hierarchical folder structure for organizing assets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} FolderDocument
 * @property {string} id
 * @property {string} workspaceId - FK → workspaces
 * @property {string|null} parentId - FK → folders
 * @property {string} name
 * @property {string} path
 * @property {number} depth
 * @property {string|null} description
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<FolderDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<FolderDocument, "id">}
 */
export function createFolder(fields) {
  return {
    workspaceId: fields.workspaceId,
    parentId:    fields.parentId ?? null,
    name:        fields.name,
    path:        fields.path,
    depth:       fields.depth ?? 0,
    description: fields.description ?? null,
    createdBy:   fields.createdBy,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

export const folderConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      workspaceId: data.workspaceId,
      parentId:    data.parentId ?? null,
      name:        data.name,
      path:        data.path,
      depth:       data.depth,
      description: data.description ?? null,
      createdBy:   data.createdBy,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "folders"
 *   - workspaceId ASC, path ASC
 *   - workspaceId ASC, parentId ASC
 */
