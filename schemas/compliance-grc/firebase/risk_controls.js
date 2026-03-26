// risk_controls: maps risks to mitigating controls (many-to-many).

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} RiskControlDocument
 * @property {string}      id
 * @property {string}      riskId    - FK → risks
 * @property {string}      controlId - FK → controls
 * @property {string|null} effectivenessNotes
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<RiskControlDocument, "id" | "createdAt">} fields
 * @returns {Omit<RiskControlDocument, "id">}
 */
export function createRiskControl(fields) {
  return {
    riskId:             fields.riskId,
    controlId:          fields.controlId,
    effectivenessNotes: fields.effectivenessNotes ?? null,
    createdAt:          Timestamp.now(),
  };
}

export const riskControlConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                 snapshot.id,
      riskId:             data.riskId,
      controlId:          data.controlId,
      effectivenessNotes: data.effectivenessNotes ?? null,
      createdAt:          data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "risk_controls"
 *   - riskId ASC, controlId ASC (unique)
 */
