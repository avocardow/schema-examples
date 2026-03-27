// commissions: Commission records earned by affiliates for conversions within programs.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const COMMISSION_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  APPROVED: "approved",
  PAID: "paid",
  VOIDED: "voided",
});

export const COMMISSION_TYPE = /** @type {const} */ ({
  PERCENTAGE: "percentage",
  FLAT: "flat",
  HYBRID: "hybrid",
});

/**
 * @typedef {Object} CommissionDocument
 * @property {string} id
 * @property {string} conversionId - FK → conversions
 * @property {string} affiliateId - FK → affiliates
 * @property {string} programId - FK → programs
 * @property {number} amount
 * @property {string} currency
 * @property {typeof COMMISSION_STATUS[keyof typeof COMMISSION_STATUS]} status
 * @property {typeof COMMISSION_TYPE[keyof typeof COMMISSION_TYPE]} commissionType
 * @property {number|null} commissionRate
 * @property {number|null} commissionFlat
 * @property {number} tierLevel
 * @property {Timestamp|null} approvedAt
 * @property {Timestamp|null} paidAt
 * @property {Timestamp|null} voidedAt
 * @property {string|null} voidedReason
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<CommissionDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<CommissionDocument, "id">}
 */
export function createCommission(data) {
  return {
    conversionId: data.conversionId,
    affiliateId: data.affiliateId,
    programId: data.programId,
    amount: data.amount,
    currency: data.currency,
    status: data.status ?? COMMISSION_STATUS.PENDING,
    commissionType: data.commissionType,
    commissionRate: data.commissionRate ?? null,
    commissionFlat: data.commissionFlat ?? null,
    tierLevel: data.tierLevel ?? 1,
    approvedAt: data.approvedAt ?? null,
    paidAt: data.paidAt ?? null,
    voidedAt: data.voidedAt ?? null,
    voidedReason: data.voidedReason ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const commissionConverter = {
  toFirestore(commission) {
    const { id, ...data } = commission;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      conversionId: data.conversionId,
      affiliateId: data.affiliateId,
      programId: data.programId,
      amount: data.amount,
      currency: data.currency,
      status: data.status,
      commissionType: data.commissionType,
      commissionRate: data.commissionRate ?? null,
      commissionFlat: data.commissionFlat ?? null,
      tierLevel: data.tierLevel,
      approvedAt: data.approvedAt ?? null,
      paidAt: data.paidAt ?? null,
      voidedAt: data.voidedAt ?? null,
      voidedReason: data.voidedReason ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - commissions: conversionId ASC
// - commissions: affiliateId ASC, status ASC
// - commissions: programId ASC, status ASC
// - commissions: status ASC
// - commissions: createdAt ASC
