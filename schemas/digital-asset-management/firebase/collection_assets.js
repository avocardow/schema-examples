// collection_assets: Junction table linking assets to collections.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CollectionAssetDocument
 * @property {string} id
 * @property {string} collectionId - FK → collections
 * @property {string} assetId - FK → assets
 * @property {number} position
 * @property {string} addedBy - FK → users
 * @property {import("firebase/firestore").Timestamp} addedAt
 */

/**
 * @param {Omit<CollectionAssetDocument, "id" | "addedAt">} fields
 * @returns {Omit<CollectionAssetDocument, "id">}
 */
export function createCollectionAsset(fields) {
  return {
    collectionId: fields.collectionId,
    assetId:      fields.assetId,
    position:     fields.position ?? 0,
    addedBy:      fields.addedBy,
    addedAt:      Timestamp.now(),
  };
}

export const collectionAssetConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      collectionId: data.collectionId,
      assetId:      data.assetId,
      position:     data.position,
      addedBy:      data.addedBy,
      addedAt:      data.addedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "collection_assets"
 *   - collectionId ASC, position ASC
 *   - assetId ASC
 */
