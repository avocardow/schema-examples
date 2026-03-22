// experiment_variants: Experiment variants.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ExperimentVariantDocument
 * @property {string}      id
 * @property {string}      experimentId - FK → experiments
 * @property {string}      name
 * @property {string|null} description
 * @property {boolean}     isControl
 * @property {number}      weight
 * @property {Object|null} config
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<ExperimentVariantDocument, "experimentId" | "name"> & Partial<Pick<ExperimentVariantDocument, "description" | "isControl" | "weight" | "config">>} fields
 * @returns {Omit<ExperimentVariantDocument, "id">}
 */
export function createExperimentVariant(fields) {
  return {
    experimentId: fields.experimentId,
    name:         fields.name,
    description:  fields.description ?? null,
    isControl:    fields.isControl   ?? false,
    weight:       fields.weight      ?? 0.5,
    config:       fields.config      ?? null,
    createdAt:    Timestamp.now(),
  };
}

export const experimentVariantConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      experimentId: data.experimentId,
      name:         data.name,
      description:  data.description ?? null,
      isControl:    data.isControl,
      weight:       data.weight,
      config:       data.config      ?? null,
      createdAt:    data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - experiment_variants.experimentId ASC
 *
 * Composite:
 *   - experiment_variants.experimentId ASC, experiment_variants.isControl ASC
 */
