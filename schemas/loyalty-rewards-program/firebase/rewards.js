// rewards: Catalog of available rewards with points cost and inventory tracking.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const REWARD_TYPE = /** @type {const} */ ({
  DISCOUNT_PERCENTAGE: "discount_percentage",
  DISCOUNT_FIXED: "discount_fixed",
  FREE_PRODUCT: "free_product",
  FREE_SHIPPING: "free_shipping",
  GIFT_CARD: "gift_card",
  EXPERIENCE: "experience",
  CUSTOM: "custom",
});

/**
 * @typedef {Object} RewardDocument
 * @property {string} id
 * @property {string} programId - FK → loyalty_programs
 * @property {string} name
 * @property {string|null} description
 * @property {typeof REWARD_TYPE[keyof typeof REWARD_TYPE]} rewardType
 * @property {number} pointsCost
 * @property {number|null} rewardValue
 * @property {string|null} currency
 * @property {string|null} imageUrl
 * @property {number|null} inventory
 * @property {number|null} maxRedemptionsPerMember
 * @property {boolean} isActive
 * @property {string|null} minTierId - FK → tiers
 * @property {Object|null} metadata
 * @property {number} sortOrder
 * @property {Timestamp|null} validFrom
 * @property {Timestamp|null} validUntil
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<RewardDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<RewardDocument, "id">}
 */
export function createReward(data) {
  return {
    programId: data.programId,
    name: data.name,
    description: data.description ?? null,
    rewardType: data.rewardType,
    pointsCost: data.pointsCost,
    rewardValue: data.rewardValue ?? null,
    currency: data.currency ?? null,
    imageUrl: data.imageUrl ?? null,
    inventory: data.inventory ?? null,
    maxRedemptionsPerMember: data.maxRedemptionsPerMember ?? null,
    isActive: data.isActive ?? true,
    minTierId: data.minTierId ?? null,
    metadata: data.metadata ?? null,
    sortOrder: data.sortOrder ?? 0,
    validFrom: data.validFrom ?? null,
    validUntil: data.validUntil ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const rewardConverter = {
  toFirestore(reward) {
    const { id, ...data } = reward;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      programId: data.programId,
      name: data.name,
      description: data.description ?? null,
      rewardType: data.rewardType,
      pointsCost: data.pointsCost,
      rewardValue: data.rewardValue ?? null,
      currency: data.currency ?? null,
      imageUrl: data.imageUrl ?? null,
      inventory: data.inventory ?? null,
      maxRedemptionsPerMember: data.maxRedemptionsPerMember ?? null,
      isActive: data.isActive,
      minTierId: data.minTierId ?? null,
      metadata: data.metadata ?? null,
      sortOrder: data.sortOrder,
      validFrom: data.validFrom ?? null,
      validUntil: data.validUntil ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - rewards: programId ASC, isActive ASC
// - rewards: rewardType ASC
// - rewards: minTierId ASC
