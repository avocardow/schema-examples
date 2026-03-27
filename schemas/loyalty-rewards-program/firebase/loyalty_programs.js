// loyalty_programs: Top-level loyalty program configuration with currency, earning, and expiration settings.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const LOYALTY_PROGRAM_STATUS = /** @type {const} */ ({
  DRAFT: "draft",
  ACTIVE: "active",
  PAUSED: "paused",
  ARCHIVED: "archived",
});

/**
 * @typedef {Object} LoyaltyProgramDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {typeof LOYALTY_PROGRAM_STATUS[keyof typeof LOYALTY_PROGRAM_STATUS]} status
 * @property {string} currencyName
 * @property {number} pointsPerCurrency
 * @property {string|null} currency
 * @property {number|null} pointsExpiryDays
 * @property {boolean} allowNegative
 * @property {boolean} isPublic
 * @property {string|null} termsUrl
 * @property {Object|null} metadata
 * @property {string} createdBy - FK → users
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<LoyaltyProgramDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<LoyaltyProgramDocument, "id">}
 */
export function createLoyaltyProgram(data) {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    status: data.status ?? LOYALTY_PROGRAM_STATUS.DRAFT,
    currencyName: data.currencyName ?? "points",
    pointsPerCurrency: data.pointsPerCurrency ?? 1,
    currency: data.currency ?? null,
    pointsExpiryDays: data.pointsExpiryDays ?? null,
    allowNegative: data.allowNegative ?? false,
    isPublic: data.isPublic ?? true,
    termsUrl: data.termsUrl ?? null,
    metadata: data.metadata ?? {},
    createdBy: data.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const loyaltyProgramConverter = {
  toFirestore(program) {
    const { id, ...data } = program;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      status: data.status,
      currencyName: data.currencyName,
      pointsPerCurrency: data.pointsPerCurrency,
      currency: data.currency ?? null,
      pointsExpiryDays: data.pointsExpiryDays ?? null,
      allowNegative: data.allowNegative,
      isPublic: data.isPublic,
      termsUrl: data.termsUrl ?? null,
      metadata: data.metadata ?? {},
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - loyalty_programs: status ASC
// - loyalty_programs: createdBy ASC
