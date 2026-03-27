// tier_benefits: Specific benefits unlocked at each tier (multipliers, perks, access).
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const BENEFIT_TYPE = /** @type {const} */ ({
  POINTS_MULTIPLIER: "points_multiplier",
  FREE_SHIPPING: "free_shipping",
  EARLY_ACCESS: "early_access",
  BIRTHDAY_BONUS: "birthday_bonus",
  EXCLUSIVE_REWARDS: "exclusive_rewards",
  PRIORITY_SUPPORT: "priority_support",
  CUSTOM: "custom",
});

/**
 * @typedef {Object} TierBenefitDocument
 * @property {string} id
 * @property {string} tierId - FK → tiers
 * @property {typeof BENEFIT_TYPE[keyof typeof BENEFIT_TYPE]} benefitType
 * @property {string|null} value
 * @property {string} description
 * @property {boolean} isActive
 * @property {number} sortOrder
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<TierBenefitDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<TierBenefitDocument, "id">}
 */
export function createTierBenefit(data) {
  return {
    tierId: data.tierId,
    benefitType: data.benefitType,
    value: data.value ?? null,
    description: data.description,
    isActive: data.isActive ?? true,
    sortOrder: data.sortOrder ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const tierBenefitConverter = {
  toFirestore(benefit) {
    const { id, ...data } = benefit;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      tierId: data.tierId,
      benefitType: data.benefitType,
      value: data.value ?? null,
      description: data.description,
      isActive: data.isActive,
      sortOrder: data.sortOrder,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - tier_benefits: tierId ASC
// - tier_benefits: benefitType ASC
