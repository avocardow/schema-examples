// categories: Product category hierarchy with nested tree structure.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} CategoryDocument
 * @property {string} id
 * @property {string|null} parentId - FK → categories (self-referential)
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string} path
 * @property {number} depth
 * @property {number} sortOrder
 * @property {boolean} isActive
 * @property {string|null} imageUrl
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createCategory(fields) {
  return {
    parentId: fields.parentId ?? null,
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    path: fields.path,
    depth: fields.depth ?? 0,
    sortOrder: fields.sortOrder ?? 0,
    isActive: fields.isActive ?? true,
    imageUrl: fields.imageUrl ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const categoryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      parentId: data.parentId ?? null,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      path: data.path,
      depth: data.depth,
      sortOrder: data.sortOrder,
      isActive: data.isActive,
      imageUrl: data.imageUrl ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - categories: parentId ASC
  - categories: path ASC
  - categories: isActive ASC, sortOrder ASC
*/
