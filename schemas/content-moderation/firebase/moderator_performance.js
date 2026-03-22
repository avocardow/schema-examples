// moderator_performance: Pre-aggregated moderator performance metrics.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ModeratorPerformanceDocument
 * @property {string}    id                        - Document ID (from snapshot.id).
 * @property {string}    moderatorId               - FK → users. The moderator being measured.
 * @property {Timestamp} periodStart               - Start of the measurement period.
 * @property {Timestamp} periodEnd                 - End of the measurement period.
 * @property {number}    itemsReviewed             - Total queue items reviewed during this period.
 * @property {number}    itemsActioned             - Items where enforcement action was taken.
 * @property {number}    averageReviewTimeSeconds   - Mean time from assignment to resolution, in seconds.
 * @property {number}    appealsOverturned          - Actions by this moderator overturned on appeal.
 * @property {number}    accuracyScore             - 1.0 - (appealsOverturned / itemsActioned), clamped 0-1.
 * @property {Timestamp} computedAt                - When this rollup was last computed.
 * @property {Timestamp} createdAt
 */

/**
 * @param {Omit<ModeratorPerformanceDocument, "id" | "createdAt">} fields
 * @returns {Omit<ModeratorPerformanceDocument, "id">}
 */
export function createModeratorPerformance(fields) {
  return {
    moderatorId:              fields.moderatorId,
    periodStart:              fields.periodStart,
    periodEnd:                fields.periodEnd,
    itemsReviewed:            fields.itemsReviewed            ?? 0,
    itemsActioned:            fields.itemsActioned            ?? 0,
    averageReviewTimeSeconds: fields.averageReviewTimeSeconds ?? 0,
    appealsOverturned:        fields.appealsOverturned        ?? 0,
    accuracyScore:            fields.accuracyScore            ?? 1.0,
    computedAt:               fields.computedAt               ?? Timestamp.now(),
    createdAt:                Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("moderator_performance").withConverter(moderatorPerformanceConverter)
 */
export const moderatorPerformanceConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                       snapshot.id,
      moderatorId:              data.moderatorId,
      periodStart:              data.periodStart,
      periodEnd:                data.periodEnd,
      itemsReviewed:            data.itemsReviewed,
      itemsActioned:            data.itemsActioned,
      averageReviewTimeSeconds: data.averageReviewTimeSeconds,
      appealsOverturned:        data.appealsOverturned,
      accuracyScore:            data.accuracyScore,
      computedAt:               data.computedAt,
      createdAt:                data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite (unique):
 *   - moderator_performance (moderatorId ASC, periodStart ASC, periodEnd ASC)
 *     — One rollup per moderator per period.
 *
 * Single-field:
 *   - moderator_performance.moderatorId ASC  — "All performance records for this moderator."
 *
 * Composite:
 *   - moderator_performance (periodStart ASC, periodEnd ASC)
 *     — "All performance records for this period."
 */
