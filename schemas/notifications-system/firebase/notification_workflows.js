// notification_workflows: Orchestration definitions for multi-step notification delivery.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_workflows"
 * Document ID: Firestore auto-generated or UUID
 *
 * A workflow defines the sequence of steps that happen when an event is triggered:
 * which channels to deliver to, in what order, with what delays, digest windows,
 * and conditions. Inspired by Novu's NotificationTemplate (workflow) and Knock's
 * workflow steps.
 *
 * Security notes:
 *   - Critical workflows bypass user preferences entirely. Use sparingly.
 *   - Cascade-delete related workflow_steps and workflow_runs when a workflow is deleted.
 */

/**
 * @typedef {Object} NotificationWorkflowDocument
 * @property {string}         name                - Display name (e.g., "Comment Notification", "Weekly Digest").
 * @property {string}         slug                - Identifier used in code and API (e.g., "comment_notification"). Unique.
 * @property {string|null}    description         - Optional description of the workflow.
 * @property {string|null}    categoryId          - Reference to the notification category this workflow handles. Set-null on category delete.
 * @property {boolean}        isCritical          - Critical workflows bypass user preferences entirely.
 * @property {boolean}        isActive            - Toggle a workflow without deleting it.
 * @property {string}         triggerIdentifier   - What your app code calls to fire this workflow. Unique.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Omit<NotificationWorkflowDocument, "createdAt" | "updatedAt"> & Partial<Pick<NotificationWorkflowDocument, "isCritical" | "isActive">>} fields
 * @returns {Omit<NotificationWorkflowDocument, "id">}
 */
export function createNotificationWorkflow(fields) {
  return {
    name:              fields.name,
    slug:              fields.slug,
    description:       fields.description       ?? null,
    categoryId:        fields.categoryId        ?? null,
    isCritical:        fields.isCritical        ?? false,
    isActive:          fields.isActive          ?? true,
    triggerIdentifier: fields.triggerIdentifier,
    createdAt:         Timestamp.now(),
    updatedAt:         Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_workflows").withConverter(notificationWorkflowConverter)
 */
export const notificationWorkflowConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      name:              data.name,
      slug:              data.slug,
      description:       data.description       ?? null,
      categoryId:        data.categoryId        ?? null,
      isCritical:        data.isCritical        ?? false,
      isActive:          data.isActive          ?? true,
      triggerIdentifier: data.triggerIdentifier,
      createdAt:         data.createdAt,           // Timestamp
      updatedAt:         data.updatedAt,           // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_workflows.slug               ASC  — Unique lookup by slug.
 *   - notification_workflows.triggerIdentifier   ASC  — Unique lookup when a trigger fires.
 *   - notification_workflows.categoryId          ASC  — "All workflows for this category."
 *   - notification_workflows.isActive            ASC  — "All active workflows."
 */
