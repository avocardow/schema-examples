// affiliates: Affiliate accounts linked to programs with referral codes, commission overrides, and payout details.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const AFFILIATE_STATUS = /** @type {const} */ ({
  PENDING:   "pending",
  ACTIVE:    "active",
  SUSPENDED: "suspended",
  REJECTED:  "rejected",
});

/**
 * @typedef {Object} AffiliateDocument
 * @property {string} id - Document ID (from snapshot.id).
 * @property {string} programId - FK → programs
 * @property {string} userId - FK → users
 * @property {string} referralCode
 * @property {string|null} couponCode
 * @property {typeof AFFILIATE_STATUS[keyof typeof AFFILIATE_STATUS]} status
 * @property {number|null} customCommissionRate
 * @property {string|null} payoutMethod
 * @property {string|null} payoutEmail
 * @property {Object} metadata
 * @property {string|null} referredBy - FK → affiliates
 * @property {import("firebase/firestore").Timestamp|null} approvedAt
 * @property {import("firebase/firestore").Timestamp|null} suspendedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<AffiliateDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<AffiliateDocument, "id">}
 */
export function createAffiliate(data) {
  return {
    programId:            data.programId,
    userId:               data.userId,
    referralCode:         data.referralCode,
    couponCode:           data.couponCode ?? null,
    status:               data.status ?? AFFILIATE_STATUS.PENDING,
    customCommissionRate: data.customCommissionRate ?? null,
    payoutMethod:         data.payoutMethod ?? null,
    payoutEmail:          data.payoutEmail ?? null,
    metadata:             data.metadata ?? {},
    referredBy:           data.referredBy ?? null,
    approvedAt:           data.approvedAt ?? null,
    suspendedAt:          data.suspendedAt ?? null,
    createdAt:            Timestamp.now(),
    updatedAt:            Timestamp.now(),
  };
}

export const affiliateConverter = {
  toFirestore(affiliate) {
    const { id, ...data } = affiliate;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                   snapshot.id,
      programId:            data.programId,
      userId:               data.userId,
      referralCode:         data.referralCode,
      couponCode:           data.couponCode ?? null,
      status:               data.status,
      customCommissionRate: data.customCommissionRate ?? null,
      payoutMethod:         data.payoutMethod ?? null,
      payoutEmail:          data.payoutEmail ?? null,
      metadata:             data.metadata ?? {},
      referredBy:           data.referredBy ?? null,
      approvedAt:           data.approvedAt ?? null,
      suspendedAt:          data.suspendedAt ?? null,
      createdAt:            data.createdAt,
      updatedAt:            data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
//
// Single-field:
//   - affiliates.userId       ASC
//   - affiliates.status       ASC
//   - affiliates.referredBy   ASC
//
// Composite:
//   - affiliates.programId ASC, affiliates.userId ASC  (unique)
