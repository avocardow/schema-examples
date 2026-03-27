// conversions: Records successful referral conversions and their monetary value.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const CONVERSION_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  REVERSED: "reversed",
});

/**
 * @typedef {Object} ConversionDocument
 * @property {string} id
 * @property {string} referralId - FK → referrals
 * @property {string} affiliateId - FK → affiliates
 * @property {string|null} externalId
 * @property {string|null} referenceType
 * @property {number} amount
 * @property {string} currency
 * @property {typeof CONVERSION_STATUS[keyof typeof CONVERSION_STATUS]} status
 * @property {Object|null} metadata
 * @property {Timestamp|null} approvedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<ConversionDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<ConversionDocument, "id">}
 */
export function createConversion(data) {
  return {
    referralId: data.referralId,
    affiliateId: data.affiliateId,
    externalId: data.externalId ?? null,
    referenceType: data.referenceType ?? null,
    amount: data.amount ?? 0,
    currency: data.currency,
    status: data.status ?? CONVERSION_STATUS.PENDING,
    metadata: data.metadata ?? null,
    approvedAt: data.approvedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const conversionConverter = {
  toFirestore(conversion) {
    const { id, ...data } = conversion;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      referralId: data.referralId,
      affiliateId: data.affiliateId,
      externalId: data.externalId ?? null,
      referenceType: data.referenceType ?? null,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      metadata: data.metadata ?? null,
      approvedAt: data.approvedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - conversions: referralId ASC
// - conversions: affiliateId ASC, status ASC
// - conversions: externalId ASC
// - conversions: status ASC
// - conversions: createdAt ASC
