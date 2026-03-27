// points_transactions: Immutable ledger of every point movement (earn, redeem, expire, adjust).
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const POINTS_TRANSACTION_TYPE = /** @type {const} */ ({
  EARN: "earn",
  REDEEM: "redeem",
  EXPIRE: "expire",
  ADJUST: "adjust",
  BONUS: "bonus",
});

/**
 * @typedef {Object} PointsTransactionDocument
 * @property {string} id
 * @property {string} memberId - FK → loyalty_members
 * @property {typeof POINTS_TRANSACTION_TYPE[keyof typeof POINTS_TRANSACTION_TYPE]} type
 * @property {number} points
 * @property {number} balanceAfter
 * @property {string|null} description
 * @property {string|null} sourceReferenceType
 * @property {string|null} sourceReferenceId
 * @property {string|null} earningRuleId - FK → earning_rules
 * @property {string|null} promotionId - FK → promotions
 * @property {string|null} redemptionId - FK → reward_redemptions
 * @property {Timestamp|null} expiresAt
 * @property {boolean} isPending
 * @property {Timestamp|null} confirmedAt
 * @property {Timestamp} createdAt
 */

/**
 * @param {Omit<PointsTransactionDocument, "id" | "createdAt">} data
 * @returns {Omit<PointsTransactionDocument, "id">}
 */
export function createPointsTransaction(data) {
  return {
    memberId: data.memberId,
    type: data.type,
    points: data.points,
    balanceAfter: data.balanceAfter,
    description: data.description ?? null,
    sourceReferenceType: data.sourceReferenceType ?? null,
    sourceReferenceId: data.sourceReferenceId ?? null,
    earningRuleId: data.earningRuleId ?? null,
    promotionId: data.promotionId ?? null,
    redemptionId: data.redemptionId ?? null,
    expiresAt: data.expiresAt ?? null,
    isPending: data.isPending ?? false,
    confirmedAt: data.confirmedAt ?? null,
    createdAt: Timestamp.now(),
  };
}

export const pointsTransactionConverter = {
  toFirestore(transaction) {
    const { id, ...data } = transaction;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      memberId: data.memberId,
      type: data.type,
      points: data.points,
      balanceAfter: data.balanceAfter,
      description: data.description ?? null,
      sourceReferenceType: data.sourceReferenceType ?? null,
      sourceReferenceId: data.sourceReferenceId ?? null,
      earningRuleId: data.earningRuleId ?? null,
      promotionId: data.promotionId ?? null,
      redemptionId: data.redemptionId ?? null,
      expiresAt: data.expiresAt ?? null,
      isPending: data.isPending,
      confirmedAt: data.confirmedAt ?? null,
      createdAt: data.createdAt,
    };
  },
};

// Suggested Firestore indexes:
// - points_transactions: memberId ASC, createdAt DESC
// - points_transactions: type ASC
// - points_transactions: expiresAt ASC
// - points_transactions: isPending ASC
// - points_transactions: sourceReferenceType ASC, sourceReferenceId ASC
