// notification_workflow_steps: Individual steps within a workflow defining multi-step notification delivery.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_workflow_steps"
 * Document ID: Firestore auto-generated or UUID
 *
 * Each step in a workflow performs a specific action: deliver to a channel, wait, batch events
 * into a digest, evaluate a condition, or throttle delivery frequency. Steps execute in ascending
 * step_order within their parent workflow.
 *
 * Security notes:
 *   - Cascade-delete steps when the owning workflow is deleted.
 *   - The config field may contain routing details — validate server-side before execution.
 */

/**
 * @typedef {"channel"|"delay"|"digest"|"condition"|"throttle"} StepType
 */

export const STEP_TYPES = /** @type {const} */ ({
  CHANNEL:   "channel",
  DELAY:     "delay",
  DIGEST:    "digest",
  CONDITION: "condition",
  THROTTLE:  "throttle",
});

/**
 * @typedef {"email"|"sms"|"push"|"in_app"|"chat"|"webhook"} ChannelType
 */

export const CHANNEL_TYPES = /** @type {const} */ ({
  EMAIL:   "email",
  SMS:     "sms",
  PUSH:    "push",
  IN_APP:  "in_app",
  CHAT:    "chat",
  WEBHOOK: "webhook",
});

/**
 * @typedef {Object} NotificationWorkflowStepDocument
 * @property {string}         workflowId       - Reference to the parent workflow. Cascade-delete steps when the workflow is deleted.
 * @property {number}         stepOrder        - Execution order within the workflow. Steps run in ascending order. Unique per workflow.
 * @property {StepType}       stepType         - What this step does: channel, delay, digest, condition, or throttle.
 * @property {ChannelType|null} channelType    - For channel steps: which channel type to deliver to. Null for non-channel step types.
 * @property {Object|null}    config           - Step configuration as JSON. Schema depends on stepType.
 * @property {boolean}        shouldStopOnFail - Whether the workflow should abort remaining steps if this step fails.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Omit<NotificationWorkflowStepDocument, "createdAt" | "updatedAt"> & Partial<Pick<NotificationWorkflowStepDocument, "config" | "shouldStopOnFail">>} fields
 * @returns {Omit<NotificationWorkflowStepDocument, "id">}
 */
export function createNotificationWorkflowStep(fields) {
  return {
    workflowId:       fields.workflowId,
    stepOrder:        fields.stepOrder,
    stepType:         fields.stepType,
    channelType:      fields.channelType      ?? null,
    config:           fields.config           ?? {},
    shouldStopOnFail: fields.shouldStopOnFail ?? false,
    createdAt:        Timestamp.now(),
    updatedAt:        Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_workflow_steps").withConverter(notificationWorkflowStepConverter)
 */
export const notificationWorkflowStepConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      workflowId:       data.workflowId,
      stepOrder:        data.stepOrder,
      stepType:         data.stepType,
      channelType:      data.channelType      ?? null,
      config:           data.config           ?? {},
      shouldStopOnFail: data.shouldStopOnFail ?? false,
      createdAt:        data.createdAt,                  // Timestamp
      updatedAt:        data.updatedAt,                  // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_workflow_steps.workflowId   ASC  — "All steps for this workflow, in order."
 *
 * Composite:
 *   - notification_workflow_steps.workflowId + stepOrder   ASC  — Unique constraint: step order must be unique within a workflow.
 */
