// promotions: Time-limited bonus earning campaigns (multipliers, fixed bonuses).
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const PROMOTION_TYPE = /** @type {const} */ ({
  MULTIPLIER: "multiplier",
  FIXED_BONUS: "fixed_bonus",
});

export const PROMOTION_STATUS = /** @type {const} */ ({
  SCHEDULED: "scheduled",
  ACTIVE: "active",
  ENDED: "ended",
  CANCELED: "canceled",
});

/**
 * @typedef {Object} PromotionDocument
 * @property {string} id
 * @property {string} programId - FK → loyalty_programs
 * @property {string} name
 * @property {string|null} description
 * @property {typeof PROMOTION_TYPE[keyof typeof PROMOTION_TYPE]} promotionType
 * @property {number|null} multiplier
 * @property {number|null} bonusPoints
 * @property {string|null} eventType
 * @property {Object|null} conditions
 * @property {typeof PROMOTION_STATUS[keyof typeof PROMOTION_STATUS]} status
 * @property {Timestamp} startsAt
 * @property {Timestamp} endsAt
 * @property {number|null} maxPointsPerMember
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<PromotionDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<PromotionDocument, "id">}
 */
export function createPromotion(data) {
  return {
    programId: data.programId,
    name: data.name,
    description: data.description ?? null,
    promotionType: data.promotionType ?? PROMOTION_TYPE.MULTIPLIER,
    multiplier: data.multiplier ?? null,
    bonusPoints: data.bonusPoints ?? null,
    eventType: data.eventType ?? null,
    conditions: data.conditions ?? null,
    status: data.status ?? PROMOTION_STATUS.SCHEDULED,
    startsAt: data.startsAt,
    endsAt: data.endsAt,
    maxPointsPerMember: data.maxPointsPerMember ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const promotionConverter = {
  toFirestore(promotion) {
    const { id, ...data } = promotion;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      programId: data.programId,
      name: data.name,
      description: data.description ?? null,
      promotionType: data.promotionType,
      multiplier: data.multiplier ?? null,
      bonusPoints: data.bonusPoints ?? null,
      eventType: data.eventType ?? null,
      conditions: data.conditions ?? null,
      status: data.status,
      startsAt: data.startsAt,
      endsAt: data.endsAt,
      maxPointsPerMember: data.maxPointsPerMember ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - promotions: programId ASC, status ASC
// - promotions: status ASC
// - promotions: startsAt ASC, endsAt ASC
