// control_requirements: maps controls to framework requirements (many-to-many).

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} ControlRequirementDocument
 * @property {string}      id
 * @property {string}      controlId     - FK → controls
 * @property {string}      requirementId - FK → framework_requirements
 * @property {string|null} notes
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ControlRequirementDocument, "id" | "createdAt">} fields
 * @returns {Omit<ControlRequirementDocument, "id">}
 */
export function createControlRequirement(fields) {
  return {
    controlId:     fields.controlId,
    requirementId: fields.requirementId,
    notes:         fields.notes ?? null,
    createdAt:     Timestamp.now(),
  };
}

export const controlRequirementConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      controlId:     data.controlId,
      requirementId: data.requirementId,
      notes:         data.notes ?? null,
      createdAt:     data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "control_requirements"
 *   - controlId ASC, requirementId ASC (unique)
 */
