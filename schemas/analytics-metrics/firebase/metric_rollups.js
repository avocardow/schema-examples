// metric_rollups: Pre-aggregated metric values.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const METRIC_GRANULARITY = /** @type {const} */ ({
  HOURLY:  "hourly",
  DAILY:   "daily",
  WEEKLY:  "weekly",
  MONTHLY: "monthly",
});

/**
 * @typedef {Object} MetricRollupDocument
 * @property {string}      id
 * @property {string}      metricId     - FK → metric_definitions
 * @property {string}      granularity
 * @property {Timestamp}   periodStart
 * @property {Timestamp}   periodEnd
 * @property {number}      value
 * @property {number}      count
 * @property {Object|null} dimensions
 * @property {Timestamp}   computedAt
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<MetricRollupDocument, "metricId" | "granularity" | "periodStart" | "periodEnd" | "value" | "computedAt"> & Partial<Pick<MetricRollupDocument, "count" | "dimensions">>} fields
 * @returns {Omit<MetricRollupDocument, "id">}
 */
export function createMetricRollup(fields) {
  return {
    metricId:    fields.metricId,
    granularity: fields.granularity,
    periodStart: fields.periodStart,
    periodEnd:   fields.periodEnd,
    value:       fields.value,
    count:       fields.count      ?? 0,
    dimensions:  fields.dimensions ?? null,
    computedAt:  fields.computedAt,
    createdAt:   Timestamp.now(),
  };
}

export const metricRollupConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      metricId:    data.metricId,
      granularity: data.granularity,
      periodStart: data.periodStart,
      periodEnd:   data.periodEnd,
      value:       data.value,
      count:       data.count,
      dimensions:  data.dimensions ?? null,
      computedAt:  data.computedAt,
      createdAt:   data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - metric_rollups.metricId    ASC
 *   - metric_rollups.granularity ASC
 *   - metric_rollups.periodStart DESC
 *
 * Composite:
 *   - metric_rollups.metricId ASC, metric_rollups.granularity ASC, metric_rollups.periodStart DESC
 */
