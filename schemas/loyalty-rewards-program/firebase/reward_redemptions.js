// reward_redemptions: Records of members redeeming points for rewards with fulfillment lifecycle.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const REDEMPTION_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  FULFILLED: "fulfilled",
  CANCELED: "canceled",
  EXPIRED: "expired",
});

/**
 * @typedef {Object} RewardRedemptionDocument
 * @property {string} id
 * @property {string} memberId - FK → loyalty_members
 * @property {string} rewardId - FK → rewards
 * @property {number} pointsSpent
 * @property {typeof REDEMPTION_STATUS[keyof typeof REDEMPTION_STATUS]} status
 * @property {string|null} couponCode
 * @property {Timestamp|null} fulfilledAt
 * @property {Timestamp|null} canceledAt
 * @property {Timestamp|null} expiresAt
 * @property {Object|null} metadata
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<RewardRedemptionDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<RewardRedemptionDocument, "id">}
 */
export function createRewardRedemption(data) {
  return {
    memberId: data.memberId,
    rewardId: data.rewardId,
    pointsSpent: data.pointsSpent,
    status: data.status ?? REDEMPTION_STATUS.PENDING,
    couponCode: data.couponCode ?? null,
    fulfilledAt: data.fulfilledAt ?? null,
    canceledAt: data.canceledAt ?? null,
    expiresAt: data.expiresAt ?? null,
    metadata: data.metadata ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const rewardRedemptionConverter = {
  toFirestore(redemption) {
    const { id, ...data } = redemption;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      memberId: data.memberId,
      rewardId: data.rewardId,
      pointsSpent: data.pointsSpent,
      status: data.status,
      couponCode: data.couponCode ?? null,
      fulfilledAt: data.fulfilledAt ?? null,
      canceledAt: data.canceledAt ?? null,
      expiresAt: data.expiresAt ?? null,
      metadata: data.metadata ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - reward_redemptions: memberId ASC, createdAt DESC
// - reward_redemptions: rewardId ASC
// - reward_redemptions: status ASC
