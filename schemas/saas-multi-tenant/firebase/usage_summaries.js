// usage_summaries: Aggregated usage data per organization, feature, and period.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} UsageSummaryDocument
 * @property {string}    id
 * @property {string}    organizationId - FK → organizations
 * @property {string}    featureId      - FK → features
 * @property {Timestamp} periodStart
 * @property {Timestamp} periodEnd
 * @property {number}    totalQuantity
 * @property {number}    eventCount
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<UsageSummaryDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<UsageSummaryDocument, "id">}
 */
export function createUsageSummary(fields) {
  const now = Timestamp.now();
  return {
    organizationId: fields.organizationId,
    featureId:      fields.featureId,
    periodStart:    fields.periodStart,
    periodEnd:      fields.periodEnd,
    totalQuantity:  fields.totalQuantity ?? 0,
    eventCount:     fields.eventCount    ?? 0,
    createdAt:      now,
    updatedAt:      now,
  };
}

export const usageSummaryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId,
      featureId:      data.featureId,
      periodStart:    data.periodStart,
      periodEnd:      data.periodEnd,
      totalQuantity:  data.totalQuantity,
      eventCount:     data.eventCount,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - usage_summaries.organizationId ASC, usage_summaries.featureId ASC, usage_summaries.periodStart ASC (unique)
 *   - usage_summaries.periodStart ASC, usage_summaries.periodEnd ASC
 */
