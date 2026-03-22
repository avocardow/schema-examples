// experiments: A/B test definitions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const EXPERIMENT_STATUS = /** @type {const} */ ({
  DRAFT:     "draft",
  RUNNING:   "running",
  PAUSED:    "paused",
  COMPLETED: "completed",
});

/**
 * @typedef {Object} ExperimentDocument
 * @property {string}         id
 * @property {string}         name
 * @property {string|null}    description
 * @property {string|null}    hypothesis
 * @property {string}         status
 * @property {number}         trafficPercentage
 * @property {Timestamp|null} startedAt
 * @property {Timestamp|null} endedAt
 * @property {string}         createdBy     - FK → users
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Pick<ExperimentDocument, "name" | "createdBy"> & Partial<Pick<ExperimentDocument, "description" | "hypothesis" | "status" | "trafficPercentage" | "startedAt" | "endedAt">>} fields
 * @returns {Omit<ExperimentDocument, "id">}
 */
export function createExperiment(fields) {
  return {
    name:              fields.name,
    description:       fields.description       ?? null,
    hypothesis:        fields.hypothesis        ?? null,
    status:            fields.status            ?? "draft",
    trafficPercentage: fields.trafficPercentage ?? 1.0,
    startedAt:         fields.startedAt         ?? null,
    endedAt:           fields.endedAt           ?? null,
    createdBy:         fields.createdBy,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

export const experimentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      name:              data.name,
      description:       data.description       ?? null,
      hypothesis:        data.hypothesis        ?? null,
      status:            data.status,
      trafficPercentage: data.trafficPercentage,
      startedAt:         data.startedAt         ?? null,
      endedAt:           data.endedAt           ?? null,
      createdBy:         data.createdBy,
      createdAt:         data.createdAt,
      updatedAt:         data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - experiments.name      ASC
 *   - experiments.status    ASC
 *   - experiments.createdBy ASC
 *
 * Composite:
 *   - experiments.status ASC, experiments.createdAt DESC
 */
