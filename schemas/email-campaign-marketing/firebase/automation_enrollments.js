// automation_enrollments: Tracks contacts progressing through automation workflows.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ENROLLMENT_STATUS = /** @type {const} */ ({
  ACTIVE: "active",
  COMPLETED: "completed",
  PAUSED: "paused",
  EXITED: "exited",
});

/**
 * @typedef {Object} AutomationEnrollmentDocument
 * @property {string} id
 * @property {string} workflowId - FK → automation_workflows
 * @property {string} contactId - FK → contacts
 * @property {string|null} currentStepId - FK → automation_steps
 * @property {typeof ENROLLMENT_STATUS[keyof typeof ENROLLMENT_STATUS]} status
 * @property {import("firebase/firestore").Timestamp} enrolledAt
 * @property {import("firebase/firestore").Timestamp|null} completedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<AutomationEnrollmentDocument, "id" | "createdAt" | "updatedAt" | "enrolledAt">} fields
 * @returns {Omit<AutomationEnrollmentDocument, "id">}
 */
export function createAutomationEnrollment(fields) {
  const now = Timestamp.now();
  return {
    workflowId:    fields.workflowId,
    contactId:     fields.contactId,
    currentStepId: fields.currentStepId ?? null,
    status:        fields.status        ?? ENROLLMENT_STATUS.ACTIVE,
    enrolledAt:    Timestamp.now(),
    completedAt:   fields.completedAt   ?? null,
    createdAt:     now,
    updatedAt:     now,
  };
}

export const automationEnrollmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:            snapshot.id,
      workflowId:    data.workflowId,
      contactId:     data.contactId,
      currentStepId: data.currentStepId ?? null,
      status:        data.status,
      enrolledAt:    data.enrolledAt,
      completedAt:   data.completedAt   ?? null,
      createdAt:     data.createdAt,
      updatedAt:     data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - automation_enrollments (workflowId ASC, contactId ASC)  — Enforce uniqueness per workflow-contact pair.
 *
 * Single-field:
 *   - automation_enrollments.contactId  ASC  — Find all enrollments for a contact.
 *   - automation_enrollments.status     ASC  — Filter enrollments by status.
 */
