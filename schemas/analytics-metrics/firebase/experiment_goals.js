// experiment_goals: Links experiments to goals.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ExperimentGoalDocument
 * @property {string}    id
 * @property {string}    experimentId - FK → experiments
 * @property {string}    goalId       - FK → goals
 * @property {boolean}   isPrimary
 * @property {Timestamp} createdAt
 */

/**
 * @param {Pick<ExperimentGoalDocument, "experimentId" | "goalId"> & Partial<Pick<ExperimentGoalDocument, "isPrimary">>} fields
 * @returns {Omit<ExperimentGoalDocument, "id">}
 */
export function createExperimentGoal(fields) {
  return {
    experimentId: fields.experimentId,
    goalId:       fields.goalId,
    isPrimary:    fields.isPrimary ?? false,
    createdAt:    Timestamp.now(),
  };
}

export const experimentGoalConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      experimentId: data.experimentId,
      goalId:       data.goalId,
      isPrimary:    data.isPrimary,
      createdAt:    data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - experiment_goals.experimentId ASC
 *   - experiment_goals.goalId       ASC
 *
 * Composite:
 *   - experiment_goals.experimentId ASC, experiment_goals.isPrimary ASC
 */
