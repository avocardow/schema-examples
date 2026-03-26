// listing_variants: Variant-level pricing and stock for marketplace listings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ListingVariantDocument
 * @property {string} id
 * @property {string} listingId - FK → listings
 * @property {string} variantId - FK → product_variants
 * @property {number} price
 * @property {string} currency
 * @property {number|null} salePrice
 * @property {number} stockQuantity
 * @property {boolean} isActive
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<ListingVariantDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<ListingVariantDocument, "id">}
 */
export function createListingVariant(data) {
  return {
    listingId: data.listingId,
    variantId: data.variantId,
    price: data.price,
    currency: data.currency,
    salePrice: data.salePrice ?? null,
    stockQuantity: data.stockQuantity ?? 0,
    isActive: data.isActive ?? true,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const listingVariantConverter = {
  toFirestore(variant) {
    const { id, ...data } = variant;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      listingId: data.listingId,
      variantId: data.variantId,
      price: data.price,
      currency: data.currency,
      salePrice: data.salePrice ?? null,
      stockQuantity: data.stockQuantity,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - listingId ASC, variantId ASC
// - variantId ASC, isActive ASC
