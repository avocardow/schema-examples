// product_tags: Lightweight labels for filtering and organizing products.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProductTagDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {Timestamp} createdAt
 */

export function createProductTag(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    createdAt: Timestamp.now(),
  };
}

export const productTagConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - product_tags: slug ASC (unique)
*/
