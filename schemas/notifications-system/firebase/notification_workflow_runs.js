// notification_workflow_runs: Execution instances of a workflow. Tracks state for monitoring, debugging, and retry.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_workflow_runs"
 * Document ID: Firestore auto-generated or UUID
 *
 * Each time a workflow is triggered by an event, a run is created to track execution state.
 * Cascade-delete runs when the owning workflow or triggering event is deleted.
 */

/**
 * @typedef {"pending"|"running"|"completed"|"failed"|"canceled"} WorkflowRunStatus
 */

export const WORKFLOW_RUN_STATUSES = /** @type {const} */ ({
  PENDING:   "pending",    // Run created, not yet started.
  RUNNING:   "running",    // Actively executing steps.
  COMPLETED: "completed",  // All steps finished successfully.
  FAILED:    "failed",     // A step failed and should_stop_on_fail was true, or a fatal error occurred.
  CANCELED:  "canceled",   // Manually canceled or event expired before completion.
});

/**
 * @typedef {Object} NotificationWorkflowRunDocument
 * @property {string}              workflowId       - Reference to the workflow being executed. Cascade-delete when the workflow is deleted.
 * @property {string}              eventId          - Reference to the event that triggered this run. Cascade-delete when the event is deleted.
 * @property {WorkflowRunStatus}   status           - Execution lifecycle state.
 * @property {number|null}         currentStepOrder - Which step the workflow is currently on (or last completed). Useful for debugging.
 * @property {string|null}         errorMessage     - Human-readable description of what went wrong.
 * @property {string|null}         errorStepId      - Reference to the workflow step that caused the failure. Set-null when the step is deleted.
 * @property {Timestamp|null}      startedAt        - When execution began.
 * @property {Timestamp|null}      completedAt      - When execution finished (success or failure).
 * @property {Timestamp}           createdAt
 * @property {Timestamp}           updatedAt
 */

/**
 * @param {Pick<NotificationWorkflowRunDocument, "workflowId" | "eventId"> & Partial<Pick<NotificationWorkflowRunDocument, "currentStepOrder" | "errorMessage" | "errorStepId" | "startedAt" | "completedAt">>} fields
 * @returns {Omit<NotificationWorkflowRunDocument, "id">}
 */
export function createNotificationWorkflowRun(fields) {
  return {
    workflowId:       fields.workflowId,
    eventId:          fields.eventId,
    status:           WORKFLOW_RUN_STATUSES.PENDING,
    currentStepOrder: fields.currentStepOrder ?? null,
    errorMessage:     fields.errorMessage     ?? null,
    errorStepId:      fields.errorStepId      ?? null,
    startedAt:        fields.startedAt        ?? null,
    completedAt:      fields.completedAt      ?? null,
    createdAt:        Timestamp.now(),
    updatedAt:        Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_workflow_runs").withConverter(notificationWorkflowRunConverter)
 */
export const notificationWorkflowRunConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      workflowId:       data.workflowId,
      eventId:          data.eventId,
      status:           data.status           ?? WORKFLOW_RUN_STATUSES.PENDING,
      currentStepOrder: data.currentStepOrder ?? null,
      errorMessage:     data.errorMessage     ?? null,
      errorStepId:      data.errorStepId      ?? null,
      startedAt:        data.startedAt        ?? null,   // Timestamp | null
      completedAt:      data.completedAt      ?? null,   // Timestamp | null
      createdAt:        data.createdAt,                   // Timestamp
      updatedAt:        data.updatedAt,                   // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - notification_workflow_runs.workflowId ASC, status ASC  — "All failed runs for this workflow" (monitoring dashboard).
 *   - notification_workflow_runs.status ASC, createdAt ASC   — "All pending runs" (for the workflow executor to pick up).
 *
 * Single-field:
 *   - notification_workflow_runs.eventId    ASC  — "Workflow run for this event."
 *   - notification_workflow_runs.createdAt  ASC  — Time-range queries and retention cleanup.
 */
