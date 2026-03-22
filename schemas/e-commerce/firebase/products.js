// products: Core product catalog with category/brand associations and soft delete.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const PRODUCT_STATUS = /** @type {const} */ ({
  DRAFT:    "draft",
  ACTIVE:   "active",
  ARCHIVED: "archived",
});

/**
 * @typedef {Object} ProductDocument
 * @property {string} id
 * @property {string|null} categoryId - FK → categories
 * @property {string|null} brandId - FK → brands
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {string} status
 * @property {string|null} productType
 * @property {Object|null} options
 * @property {Object|null} metadata
 * @property {boolean} isFeatured
 * @property {Timestamp|null} deletedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createProduct(fields) {
  return {
    categoryId: fields.categoryId ?? null,
    brandId: fields.brandId ?? null,
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    status: fields.status ?? "draft",
    productType: fields.productType ?? null,
    options: fields.options ?? null,
    metadata: fields.metadata ?? {},
    isFeatured: fields.isFeatured ?? false,
    deletedAt: fields.deletedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const productConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      categoryId: data.categoryId ?? null,
      brandId: data.brandId ?? null,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      status: data.status,
      productType: data.productType ?? null,
      options: data.options ?? null,
      metadata: data.metadata ?? null,
      isFeatured: data.isFeatured,
      deletedAt: data.deletedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - products: categoryId ASC
  - products: brandId ASC
  - products: status ASC
  - products: isFeatured ASC
  - products: deletedAt ASC
  - products: status ASC, deletedAt ASC
*/
