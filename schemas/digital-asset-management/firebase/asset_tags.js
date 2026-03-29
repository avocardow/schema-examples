// asset_tags: Junction table linking tags to assets.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} AssetTagDocument
 * @property {string} id
 * @property {string} assetId - FK → assets
 * @property {string} tagId - FK → tags
 * @property {string} assignedBy - FK → users
 * @property {import("firebase/firestore").Timestamp} assignedAt
 */

/**
 * @param {Omit<AssetTagDocument, "id" | "assignedAt">} fields
 * @returns {Omit<AssetTagDocument, "id">}
 */
export function createAssetTag(fields) {
  return {
    assetId:    fields.assetId,
    tagId:      fields.tagId,
    assignedBy: fields.assignedBy,
    assignedAt: Timestamp.now(),
  };
}

export const assetTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      assetId:    data.assetId,
      tagId:      data.tagId,
      assignedBy: data.assignedBy,
      assignedAt: data.assignedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "asset_tags"
 *   - assetId ASC
 *   - tagId ASC
 */
