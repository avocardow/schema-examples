// collections: Curated groups of assets for organization and sharing.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CollectionDocument
 * @property {string} id
 * @property {string} workspaceId - FK → workspaces
 * @property {string} name
 * @property {string|null} description
 * @property {string|null} coverAssetId - FK → assets
 * @property {boolean} isPublic
 * @property {number} assetCount
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<CollectionDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<CollectionDocument, "id">}
 */
export function createCollection(fields) {
  return {
    workspaceId:  fields.workspaceId,
    name:         fields.name,
    description:  fields.description ?? null,
    coverAssetId: fields.coverAssetId ?? null,
    isPublic:     fields.isPublic ?? false,
    assetCount:   fields.assetCount ?? 0,
    createdBy:    fields.createdBy,
    createdAt:    Timestamp.now(),
    updatedAt:    Timestamp.now(),
  };
}

export const collectionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      workspaceId:  data.workspaceId,
      name:         data.name,
      description:  data.description ?? null,
      coverAssetId: data.coverAssetId ?? null,
      isPublic:     data.isPublic,
      assetCount:   data.assetCount,
      createdBy:    data.createdBy,
      createdAt:    data.createdAt,
      updatedAt:    data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "collections"
 *   - workspaceId ASC, name ASC
 *   - workspaceId ASC, isPublic ASC
 *   - createdBy ASC
 */
