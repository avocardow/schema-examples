// vendors: Marketplace vendor accounts with status and verification tracking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VENDOR_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DEACTIVATED: "deactivated",
});

export const VERIFICATION_STATUS = /** @type {const} */ ({
  UNVERIFIED: "unverified",
  PENDING_REVIEW: "pending_review",
  VERIFIED: "verified",
  REJECTED: "rejected",
});

/**
 * @typedef {Object} VendorDocument
 * @property {string} id
 * @property {string} ownerId - FK → users
 * @property {string} name
 * @property {string} slug
 * @property {string} email
 * @property {string|null} phone
 * @property {typeof VENDOR_STATUS[keyof typeof VENDOR_STATUS]} status
 * @property {typeof VERIFICATION_STATUS[keyof typeof VERIFICATION_STATUS]} verificationStatus
 * @property {number|null} commissionRate
 * @property {Object|null} metadata
 * @property {Timestamp|null} approvedAt
 * @property {Timestamp|null} suspendedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<VendorDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<VendorDocument, "id">}
 */
export function createVendor(data) {
  return {
    ownerId: data.ownerId,
    name: data.name,
    slug: data.slug,
    email: data.email,
    phone: data.phone ?? null,
    status: data.status ?? VENDOR_STATUS.PENDING,
    verificationStatus: data.verificationStatus ?? VERIFICATION_STATUS.UNVERIFIED,
    commissionRate: data.commissionRate ?? null,
    metadata: data.metadata ?? {},
    approvedAt: data.approvedAt ?? null,
    suspendedAt: data.suspendedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const vendorConverter = {
  toFirestore(vendor) {
    const { id, ...data } = vendor;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ownerId: data.ownerId,
      name: data.name,
      slug: data.slug,
      email: data.email,
      phone: data.phone ?? null,
      status: data.status,
      verificationStatus: data.verificationStatus,
      commissionRate: data.commissionRate ?? null,
      metadata: data.metadata ?? null,
      approvedAt: data.approvedAt ?? null,
      suspendedAt: data.suspendedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - ownerId ASC
// - status ASC
// - verificationStatus ASC
