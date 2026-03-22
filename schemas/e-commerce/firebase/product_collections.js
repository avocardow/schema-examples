// product_collections: Curated groupings of products for merchandising and storefront display.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProductCollectionDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string|null} imageUrl
 * @property {number} sortOrder
 * @property {boolean} isActive
 * @property {Object|null} metadata
 * @property {Timestamp|null} publishedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createProductCollection(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    imageUrl: fields.imageUrl ?? null,
    sortOrder: fields.sortOrder ?? 0,
    isActive: fields.isActive ?? true,
    metadata: fields.metadata ?? {},
    publishedAt: fields.publishedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const productCollectionConverter = {
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
      imageUrl: data.imageUrl ?? null,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
      metadata: data.metadata ?? null,
      publishedAt: data.publishedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - product_collections: isActive ASC, sortOrder ASC
*/
