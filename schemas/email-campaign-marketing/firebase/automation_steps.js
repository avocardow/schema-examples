// automation_steps: Ordered steps within an automation workflow (send email, delay, condition).
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const STEP_TYPE = /** @type {const} */ ({
  SEND_EMAIL: "send_email",
  DELAY: "delay",
  CONDITION: "condition",
});

/**
 * @typedef {Object} AutomationStepDocument
 * @property {string} id
 * @property {string} workflowId - FK → automation_workflows
 * @property {number} stepOrder
 * @property {typeof STEP_TYPE[keyof typeof STEP_TYPE]} stepType
 * @property {string|null} templateId - FK → templates
 * @property {Object|null} config
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<AutomationStepDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<AutomationStepDocument, "id">}
 */
export function createAutomationStep(fields) {
  const now = Timestamp.now();
  return {
    workflowId: fields.workflowId,
    stepOrder:  fields.stepOrder,
    stepType:   fields.stepType,
    templateId: fields.templateId ?? null,
    config:     fields.config     ?? {},
    createdAt:  now,
    updatedAt:  now,
  };
}

export const automationStepConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      workflowId: data.workflowId,
      stepOrder:  data.stepOrder,
      stepType:   data.stepType,
      templateId: data.templateId ?? null,
      config:     data.config     ?? null,
      createdAt:  data.createdAt,
      updatedAt:  data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - automation_steps (workflowId ASC, stepOrder ASC)  — Enforce uniqueness and ordering within a workflow.
 *
 * Single-field:
 *   - automation_steps.templateId  ASC  — Find steps using a specific template.
 */
