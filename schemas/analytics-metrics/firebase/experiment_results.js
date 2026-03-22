// experiment_results: Statistical results.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ExperimentResultDocument
 * @property {string}      id
 * @property {string}      experimentId - FK → experiments
 * @property {string}      variantId    - FK → experiment_variants
 * @property {string}      metricId     - FK → metric_definitions
 * @property {number}      sampleSize
 * @property {number|null} meanValue
 * @property {number|null} stddev
 * @property {number|null} ciLower
 * @property {number|null} ciUpper
 * @property {number|null} pValue
 * @property {number|null} lift
 * @property {boolean}     isSignificant
 * @property {Timestamp}   computedAt
 * @property {Timestamp}   createdAt
 * @property {Timestamp}   updatedAt
 */

/**
 * @param {Pick<ExperimentResultDocument, "experimentId" | "variantId" | "metricId" | "computedAt"> & Partial<Pick<ExperimentResultDocument, "sampleSize" | "meanValue" | "stddev" | "ciLower" | "ciUpper" | "pValue" | "lift" | "isSignificant">>} fields
 * @returns {Omit<ExperimentResultDocument, "id">}
 */
export function createExperimentResult(fields) {
  return {
    experimentId:  fields.experimentId,
    variantId:     fields.variantId,
    metricId:      fields.metricId,
    sampleSize:    fields.sampleSize    ?? 0,
    meanValue:     fields.meanValue     ?? null,
    stddev:        fields.stddev        ?? null,
    ciLower:       fields.ciLower       ?? null,
    ciUpper:       fields.ciUpper       ?? null,
    pValue:        fields.pValue        ?? null,
    lift:          fields.lift          ?? null,
    isSignificant: fields.isSignificant ?? false,
    computedAt:    fields.computedAt,
    createdAt:     Timestamp.now(),
    updatedAt:     Timestamp.now(),
  };
}

export const experimentResultConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      experimentId:  data.experimentId,
      variantId:     data.variantId,
      metricId:      data.metricId,
      sampleSize:    data.sampleSize,
      meanValue:     data.meanValue     ?? null,
      stddev:        data.stddev        ?? null,
      ciLower:       data.ciLower       ?? null,
      ciUpper:       data.ciUpper       ?? null,
      pValue:        data.pValue        ?? null,
      lift:          data.lift          ?? null,
      isSignificant: data.isSignificant,
      computedAt:    data.computedAt,
      createdAt:     data.createdAt,
      updatedAt:     data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - experiment_results.experimentId ASC
 *   - experiment_results.variantId    ASC
 *   - experiment_results.metricId     ASC
 *
 * Composite:
 *   - experiment_results.experimentId ASC, experiment_results.variantId ASC, experiment_results.metricId ASC
 */
