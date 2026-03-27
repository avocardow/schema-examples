// tiers: Tier/VIP level definitions with qualification thresholds and ordering.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const TIER_QUALIFICATION_TYPE = /** @type {const} */ ({
  POINTS_EARNED: "points_earned",
  AMOUNT_SPENT: "amount_spent",
  TRANSACTION_COUNT: "transaction_count",
});

/**
 * @typedef {Object} TierDocument
 * @property {string} id
 * @property {string} programId - FK → loyalty_programs
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {number} position
 * @property {typeof TIER_QUALIFICATION_TYPE[keyof typeof TIER_QUALIFICATION_TYPE]} qualificationType
 * @property {number} qualificationValue
 * @property {number|null} qualificationPeriodDays
 * @property {number|null} retainDays
 * @property {string|null} iconUrl
 * @property {string|null} color
 * @property {boolean} isDefault
 * @property {Object|null} metadata
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<TierDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<TierDocument, "id">}
 */
export function createTier(data) {
  return {
    programId: data.programId,
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    position: data.position,
    qualificationType: data.qualificationType ?? TIER_QUALIFICATION_TYPE.POINTS_EARNED,
    qualificationValue: data.qualificationValue,
    qualificationPeriodDays: data.qualificationPeriodDays ?? null,
    retainDays: data.retainDays ?? null,
    iconUrl: data.iconUrl ?? null,
    color: data.color ?? null,
    isDefault: data.isDefault ?? false,
    metadata: data.metadata ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const tierConverter = {
  toFirestore(tier) {
    const { id, ...data } = tier;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      programId: data.programId,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      position: data.position,
      qualificationType: data.qualificationType,
      qualificationValue: data.qualificationValue,
      qualificationPeriodDays: data.qualificationPeriodDays ?? null,
      retainDays: data.retainDays ?? null,
      iconUrl: data.iconUrl ?? null,
      color: data.color ?? null,
      isDefault: data.isDefault,
      metadata: data.metadata ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - tiers: programId ASC, slug ASC (unique per program)
// - tiers: programId ASC, position ASC (unique per program)
// - tiers: isDefault ASC
