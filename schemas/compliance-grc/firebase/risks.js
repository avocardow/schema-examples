// risks: organizational risks with likelihood, impact scoring, and treatment strategy.

import { Timestamp } from "firebase/firestore";

export const RISK_CATEGORY = /** @type {const} */ ({
  STRATEGIC:    "strategic",
  OPERATIONAL:  "operational",
  FINANCIAL:    "financial",
  COMPLIANCE:   "compliance",
  REPUTATIONAL: "reputational",
  TECHNICAL:    "technical",
  THIRD_PARTY:  "third_party",
});

export const RISK_LEVEL = /** @type {const} */ ({
  CRITICAL: "critical",
  HIGH:     "high",
  MEDIUM:   "medium",
  LOW:      "low",
  VERY_LOW: "very_low",
});

export const RISK_TREATMENT = /** @type {const} */ ({
  MITIGATE: "mitigate",
  ACCEPT:   "accept",
  TRANSFER: "transfer",
  AVOID:    "avoid",
});

export const RISK_STATUS = /** @type {const} */ ({
  IDENTIFIED: "identified",
  ASSESSING:  "assessing",
  TREATING:   "treating",
  MONITORING: "monitoring",
  CLOSED:     "closed",
});

/**
 * @typedef {Object} RiskDocument
 * @property {string}      id
 * @property {string|null} organizationId - FK → organizations
 * @property {string|null} ownerId        - FK → users
 * @property {string|null} identifier
 * @property {string}      title
 * @property {string|null} description
 * @property {typeof RISK_CATEGORY[keyof typeof RISK_CATEGORY]}   category
 * @property {number}      likelihood
 * @property {number}      impact
 * @property {typeof RISK_LEVEL[keyof typeof RISK_LEVEL]}         riskLevel
 * @property {typeof RISK_TREATMENT[keyof typeof RISK_TREATMENT]} treatment
 * @property {typeof RISK_STATUS[keyof typeof RISK_STATUS]}       status
 * @property {string|null} dueDate
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<RiskDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<RiskDocument, "id">}
 */
export function createRisk(fields) {
  return {
    organizationId: fields.organizationId ?? null,
    ownerId:        fields.ownerId        ?? null,
    identifier:     fields.identifier     ?? null,
    title:          fields.title,
    description:    fields.description    ?? null,
    category:       fields.category,
    likelihood:     fields.likelihood     ?? 3,
    impact:         fields.impact         ?? 3,
    riskLevel:      fields.riskLevel      ?? RISK_LEVEL.MEDIUM,
    treatment:      fields.treatment      ?? RISK_TREATMENT.MITIGATE,
    status:         fields.status         ?? RISK_STATUS.IDENTIFIED,
    dueDate:        fields.dueDate        ?? null,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

export const riskConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId ?? null,
      ownerId:        data.ownerId        ?? null,
      identifier:     data.identifier     ?? null,
      title:          data.title,
      description:    data.description    ?? null,
      category:       data.category,
      likelihood:     data.likelihood,
      impact:         data.impact,
      riskLevel:      data.riskLevel,
      treatment:      data.treatment,
      status:         data.status,
      dueDate:        data.dueDate        ?? null,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "risks"
 *   - organizationId ASC, riskLevel ASC
 *   - ownerId ASC
 *   - category ASC
 *   - status ASC
 *   - identifier ASC (unique)
 */
