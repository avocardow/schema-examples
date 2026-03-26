// vendor_reviews: Customer ratings and reviews for marketplace vendors.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VENDOR_REVIEW_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
});

/**
 * @typedef {Object} VendorReviewDocument
 * @property {string} id
 * @property {string} vendorId - FK → vendors
 * @property {string} customerId - FK → users
 * @property {string|null} vendorOrderId - FK → vendor_orders
 * @property {number} rating
 * @property {string|null} title
 * @property {string|null} body
 * @property {typeof VENDOR_REVIEW_STATUS[keyof typeof VENDOR_REVIEW_STATUS]} status
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<VendorReviewDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<VendorReviewDocument, "id">}
 */
export function createVendorReview(data) {
  return {
    vendorId: data.vendorId,
    customerId: data.customerId,
    vendorOrderId: data.vendorOrderId ?? null,
    rating: data.rating,
    title: data.title ?? null,
    body: data.body ?? null,
    status: data.status ?? VENDOR_REVIEW_STATUS.PENDING,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const vendorReviewConverter = {
  toFirestore(review) {
    const { id, ...data } = review;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorId: data.vendorId,
      customerId: data.customerId,
      vendorOrderId: data.vendorOrderId ?? null,
      rating: data.rating,
      title: data.title ?? null,
      body: data.body ?? null,
      status: data.status,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - vendorId ASC, status ASC
// - vendorId ASC, customerId ASC, vendorOrderId ASC
// - status ASC
