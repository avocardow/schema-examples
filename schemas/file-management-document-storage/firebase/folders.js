// folders: Folder tree with materialized path for efficient subtree queries.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "folders"
 * Document ID: Firestore auto-generated or UUID
 *
 * Folder tree with materialized path for efficient subtree queries. Uses the
 * hybrid approach: materialized path (for prefix queries like "all descendants
 * of folder X") plus parentId (for single-level directory listings). Path segments
 * use folder IDs, not names — so renaming a folder updates only the name, not
 * every descendant's path.
 */

/**
 * @typedef {Object} FolderDocument
 * @property {string}      bucketId    - Reference to a storage_buckets document.
 * @property {string|null} parentId    - Reference to a parent folders document. Null = root-level folder.
 * @property {string}      name        - Display name (e.g., "Documents", "Photos 2024").
 * @property {string}      path        - Materialized path using folder IDs as segments.
 * @property {number}      depth       - Hierarchy level. 0 = root, 1 = child of root, etc.
 * @property {string|null} description - Optional folder description.
 * @property {string}      createdBy   - Reference to a users document.
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<FolderDocument, "bucketId" | "name" | "path" | "createdBy"> & Partial<Pick<FolderDocument, "parentId" | "depth" | "description">>} fields
 * @returns {Omit<FolderDocument, "id">}
 */
export function createFolder(fields) {
  return {
    bucketId:    fields.bucketId,
    parentId:    fields.parentId    ?? null,
    name:        fields.name,
    path:        fields.path,
    depth:       fields.depth       ?? 0,
    description: fields.description ?? null,
    createdBy:   fields.createdBy,
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("folders").withConverter(folderConverter)
 */
export const folderConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      bucketId:    data.bucketId,
      parentId:    data.parentId    ?? null,
      name:        data.name,
      path:        data.path,
      depth:       data.depth       ?? 0,
      description: data.description ?? null,
      createdBy:   data.createdBy,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - folders.parentId   ASC  — "All children of this folder" (single-level listing).
 *
 * Composite:
 *   - folders.bucketId + folders.path        ASC  — Unique path within a bucket.
 *   - folders.bucketId + folders.parentId + folders.name  ASC  — Unique name within a parent.
 *   - folders.bucketId + folders.depth        ASC  — "All root folders in this bucket" (depth = 0).
 */
