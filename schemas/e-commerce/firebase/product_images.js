// product_images: Image assets linked to products or specific variants with sort ordering.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProductImageDocument
 * @property {string} id
 * @property {string} productId - FK → products
 * @property {string|null} variantId - FK → product_variants (nullable)
 * @property {string} url
 * @property {string|null} altText
 * @property {number} sortOrder
 * @property {Timestamp} createdAt
 */

export function createProductImage(fields) {
  return {
    productId: fields.productId,
    variantId: fields.variantId ?? null,
    url: fields.url,
    altText: fields.altText ?? null,
    sortOrder: fields.sortOrder ?? 0,
    createdAt: Timestamp.now(),
  };
}

export const productImageConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      productId: data.productId,
      variantId: data.variantId ?? null,
      url: data.url,
      altText: data.altText ?? null,
      sortOrder: data.sortOrder,
      createdAt: data.createdAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - product_images: productId ASC, sortOrder ASC
  - product_images: variantId ASC
*/
