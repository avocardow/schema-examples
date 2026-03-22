// product_tag_assignments: Join table linking products to their tags.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProductTagAssignmentDocument
 * @property {string} id
 * @property {string} productId - FK → products
 * @property {string} tagId - FK → product_tags
 * @property {Timestamp} createdAt
 */

export function createProductTagAssignment(fields) {
  return {
    productId: fields.productId,
    tagId: fields.tagId,
    createdAt: Timestamp.now(),
  };
}

export const productTagAssignmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      productId: data.productId,
      tagId: data.tagId,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - product_tag_assignments: productId ASC, tagId ASC (composite unique)
  - product_tag_assignments: tagId ASC
*/
