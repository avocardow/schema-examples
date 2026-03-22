// brands: Product brand identities with display ordering and active status.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} BrandDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string|null} logoUrl
 * @property {string|null} websiteUrl
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createBrand(fields) {
  return {
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    logoUrl: fields.logoUrl ?? null,
    websiteUrl: fields.websiteUrl ?? null,
    isActive: fields.isActive ?? true,
    sortOrder: fields.sortOrder ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const brandConverter = {
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
      logoUrl: data.logoUrl ?? null,
      websiteUrl: data.websiteUrl ?? null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - brands: isActive ASC, sortOrder ASC
*/
