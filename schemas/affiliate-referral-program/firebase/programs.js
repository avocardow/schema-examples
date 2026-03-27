// programs: Affiliate/referral program definitions with commission rules and attribution settings.
// See README.md for full design rationale.
import { Timestamp } from "firebase/firestore";

export const PROGRAM_STATUS = /** @type {const} */ ({
  DRAFT: "draft",
  ACTIVE: "active",
  PAUSED: "paused",
  ARCHIVED: "archived",
});

export const COMMISSION_TYPE = /** @type {const} */ ({
  PERCENTAGE: "percentage",
  FLAT: "flat",
  HYBRID: "hybrid",
});

export const ATTRIBUTION_MODEL = /** @type {const} */ ({
  FIRST_TOUCH: "first_touch",
  LAST_TOUCH: "last_touch",
});

/**
 * @typedef {Object} ProgramDocument
 * @property {string} id
 * @property {string} name
 * @property {string} slug
 * @property {string|null} description
 * @property {typeof PROGRAM_STATUS[keyof typeof PROGRAM_STATUS]} status
 * @property {typeof COMMISSION_TYPE[keyof typeof COMMISSION_TYPE]} commissionType
 * @property {number|null} commissionPercentage
 * @property {number|null} commissionFlat
 * @property {string} currency
 * @property {number} cookieDuration
 * @property {typeof ATTRIBUTION_MODEL[keyof typeof ATTRIBUTION_MODEL]} attributionModel
 * @property {number} minPayout
 * @property {boolean} autoApprove
 * @property {boolean} isPublic
 * @property {string|null} termsUrl
 * @property {string} createdBy - FK → users
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<ProgramDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<ProgramDocument, "id">}
 */
export function createProgram(data) {
  return {
    name: data.name,
    slug: data.slug,
    description: data.description ?? null,
    status: data.status ?? PROGRAM_STATUS.DRAFT,
    commissionType: data.commissionType ?? COMMISSION_TYPE.PERCENTAGE,
    commissionPercentage: data.commissionPercentage ?? null,
    commissionFlat: data.commissionFlat ?? null,
    currency: data.currency,
    cookieDuration: data.cookieDuration ?? 30,
    attributionModel: data.attributionModel ?? ATTRIBUTION_MODEL.LAST_TOUCH,
    minPayout: data.minPayout ?? 0,
    autoApprove: data.autoApprove ?? false,
    isPublic: data.isPublic ?? true,
    termsUrl: data.termsUrl ?? null,
    createdBy: data.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const programConverter = {
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
      commissionType: data.commissionType,
      commissionPercentage: data.commissionPercentage ?? null,
      commissionFlat: data.commissionFlat ?? null,
      currency: data.currency,
      cookieDuration: data.cookieDuration,
      attributionModel: data.attributionModel,
      minPayout: data.minPayout,
      autoApprove: data.autoApprove,
      isPublic: data.isPublic,
      termsUrl: data.termsUrl ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested Firestore indexes:
// - programs: status ASC
// - programs: createdBy ASC
