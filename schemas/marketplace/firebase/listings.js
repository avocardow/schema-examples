// listings: Vendor product listings with approval workflow and condition tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const LISTING_STATUS = /** @type {const} */ ({
  DRAFT: "draft",
  PENDING_APPROVAL: "pending_approval",
  ACTIVE: "active",
  PAUSED: "paused",
  REJECTED: "rejected",
  ARCHIVED: "archived",
});

export const LISTING_CONDITION = /** @type {const} */ ({
  NEW: "new",
  REFURBISHED: "refurbished",
  USED_LIKE_NEW: "used_like_new",
  USED_GOOD: "used_good",
  USED_FAIR: "used_fair",
});

/**
 * @typedef {Object} ListingDocument
 * @property {string} id
 * @property {string} vendorId - FK → vendors
 * @property {string} productId - FK → products
 * @property {typeof LISTING_STATUS[keyof typeof LISTING_STATUS]} status
 * @property {typeof LISTING_CONDITION[keyof typeof LISTING_CONDITION]} condition
 * @property {number} handlingDays
 * @property {string|null} rejectionReason
 * @property {Timestamp|null} approvedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<ListingDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<ListingDocument, "id">}
 */
export function createListing(data) {
  return {
    vendorId: data.vendorId,
    productId: data.productId,
    status: data.status ?? LISTING_STATUS.DRAFT,
    condition: data.condition ?? LISTING_CONDITION.NEW,
    handlingDays: data.handlingDays ?? 1,
    rejectionReason: data.rejectionReason ?? null,
    approvedAt: data.approvedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const listingConverter = {
  toFirestore(listing) {
    const { id, ...data } = listing;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorId: data.vendorId,
      productId: data.productId,
      status: data.status,
      condition: data.condition,
      handlingDays: data.handlingDays,
      rejectionReason: data.rejectionReason ?? null,
      approvedAt: data.approvedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - vendorId ASC, productId ASC (composite unique)
// - productId ASC, status ASC
// - status ASC
