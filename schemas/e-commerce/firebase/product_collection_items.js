// product_collection_items: Junction table linking products to curated collections with ordering.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProductCollectionItemDocument
 * @property {string} id
 * @property {string} collectionId - FK → product_collections
 * @property {string} productId - FK → products
 * @property {number} sortOrder
 * @property {Timestamp} addedAt
 */

export function createProductCollectionItem(fields) {
  return {
    collectionId: fields.collectionId,
    productId: fields.productId,
    sortOrder: fields.sortOrder ?? 0,
    addedAt: Timestamp.now(),
  };
}

export const productCollectionItemConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      collectionId: data.collectionId,
      productId: data.productId,
      sortOrder: data.sortOrder,
      addedAt: data.addedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - product_collection_items: collectionId ASC, productId ASC (composite unique)
  - product_collection_items: productId ASC
*/
