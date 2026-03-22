// experiment_assignments: User-to-variant assignments.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ExperimentAssignmentDocument
 * @property {string}      id
 * @property {string}      experimentId - FK → experiments
 * @property {string}      variantId    - FK → experiment_variants
 * @property {string|null} userId       - FK → users
 * @property {string|null} anonymousId
 * @property {Timestamp}   assignedAt
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Pick<ExperimentAssignmentDocument, "experimentId" | "variantId" | "assignedAt"> & Partial<Pick<ExperimentAssignmentDocument, "userId" | "anonymousId">>} fields
 * @returns {Omit<ExperimentAssignmentDocument, "id">}
 */
export function createExperimentAssignment(fields) {
  return {
    experimentId: fields.experimentId,
    variantId:    fields.variantId,
    userId:       fields.userId      ?? null,
    anonymousId:  fields.anonymousId ?? null,
    assignedAt:   fields.assignedAt,
    createdAt:    Timestamp.now(),
  };
}

export const experimentAssignmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      experimentId: data.experimentId,
      variantId:    data.variantId,
      userId:       data.userId      ?? null,
      anonymousId:  data.anonymousId ?? null,
      assignedAt:   data.assignedAt,
      createdAt:    data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - experiment_assignments.experimentId ASC
 *   - experiment_assignments.variantId    ASC
 *   - experiment_assignments.userId       ASC
 *   - experiment_assignments.anonymousId  ASC
 *
 * Composite:
 *   - experiment_assignments.experimentId ASC, experiment_assignments.userId ASC
 */
