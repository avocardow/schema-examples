// automation_workflows: Triggered email sequences with configurable trigger conditions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TRIGGER_TYPE = /** @type {const} */ ({
  LIST_JOIN: "list_join",
  TAG_ADDED: "tag_added",
  MANUAL: "manual",
  EVENT: "event",
});

/**
 * @typedef {Object} AutomationWorkflowDocument
 * @property {string} id
 * @property {string} name
 * @property {string|null} description
 * @property {typeof TRIGGER_TYPE[keyof typeof TRIGGER_TYPE]} triggerType
 * @property {Object|null} triggerConfig
 * @property {boolean} isActive
 * @property {string|null} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<AutomationWorkflowDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<AutomationWorkflowDocument, "id">}
 */
export function createAutomationWorkflow(fields) {
  const now = Timestamp.now();
  return {
    name:          fields.name,
    description:   fields.description   ?? null,
    triggerType:   fields.triggerType,
    triggerConfig: fields.triggerConfig  ?? {},
    isActive:      fields.isActive      ?? true,
    createdBy:     fields.createdBy     ?? null,
    createdAt:     now,
    updatedAt:     now,
  };
}

export const automationWorkflowConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      name:          data.name,
      description:   data.description   ?? null,
      triggerType:   data.triggerType,
      triggerConfig: data.triggerConfig  ?? null,
      isActive:      data.isActive,
      createdBy:     data.createdBy     ?? null,
      createdAt:     data.createdAt,
      updatedAt:     data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - automation_workflows.isActive     ASC  — Filter active/inactive workflows.
 *   - automation_workflows.triggerType   ASC  — Filter workflows by trigger type.
 */
