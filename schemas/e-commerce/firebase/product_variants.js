// product_variants: SKU-level variants of a product with dimensions and shipping info.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ProductVariantDocument
 * @property {string} id
 * @property {string} productId - FK → products
 * @property {string|null} shippingProfileId - FK → shipping_profiles
 * @property {string|null} sku
 * @property {string|null} barcode
 * @property {string} title
 * @property {Object|null} optionValues
 * @property {number|null} weightGrams
 * @property {number|null} heightMm
 * @property {number|null} widthMm
 * @property {number|null} lengthMm
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

export function createProductVariant(fields) {
  return {
    productId: fields.productId,
    shippingProfileId: fields.shippingProfileId ?? null,
    sku: fields.sku ?? null,
    barcode: fields.barcode ?? null,
    title: fields.title,
    optionValues: fields.optionValues ?? null,
    weightGrams: fields.weightGrams ?? null,
    heightMm: fields.heightMm ?? null,
    widthMm: fields.widthMm ?? null,
    lengthMm: fields.lengthMm ?? null,
    isActive: fields.isActive ?? true,
    sortOrder: fields.sortOrder ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const productVariantConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      productId: data.productId,
      shippingProfileId: data.shippingProfileId ?? null,
      sku: data.sku ?? null,
      barcode: data.barcode ?? null,
      title: data.title,
      optionValues: data.optionValues ?? null,
      weightGrams: data.weightGrams ?? null,
      heightMm: data.heightMm ?? null,
      widthMm: data.widthMm ?? null,
      lengthMm: data.lengthMm ?? null,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
  Suggested Firestore indexes:
  - product_variants: productId ASC
  - product_variants: sku ASC (unique)
  - product_variants: barcode ASC
  - product_variants: shippingProfileId ASC
*/
