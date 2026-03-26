// control_tests: records of control testing with results and scheduling.

import { Timestamp } from "firebase/firestore";

export const TEST_RESULT = /** @type {const} */ ({
  PASS:           "pass",
  FAIL:           "fail",
  PARTIAL:        "partial",
  NOT_APPLICABLE: "not_applicable",
});

/**
 * @typedef {Object} ControlTestDocument
 * @property {string}      id
 * @property {string}      controlId  - FK → controls
 * @property {string|null} testedBy   - FK → users
 * @property {import("firebase/firestore").Timestamp} testDate
 * @property {typeof TEST_RESULT[keyof typeof TEST_RESULT]} result
 * @property {string|null} notes
 * @property {import("firebase/firestore").Timestamp|null} nextTestDate
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ControlTestDocument, "id" | "createdAt">} fields
 * @returns {Omit<ControlTestDocument, "id">}
 */
export function createControlTest(fields) {
  return {
    controlId:    fields.controlId,
    testedBy:     fields.testedBy     ?? null,
    testDate:     fields.testDate,
    result:       fields.result,
    notes:        fields.notes        ?? null,
    nextTestDate: fields.nextTestDate ?? null,
    createdAt:    Timestamp.now(),
  };
}

export const controlTestConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      controlId:    data.controlId,
      testedBy:     data.testedBy     ?? null,
      testDate:     data.testDate,
      result:       data.result,
      notes:        data.notes        ?? null,
      nextTestDate: data.nextTestDate ?? null,
      createdAt:    data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "control_tests"
 *   - controlId ASC, testDate DESC
 *   - testedBy ASC
 *   - result ASC
 *   - testDate DESC
 */
