// moderation_actions: Enforcement actions taken by moderators or automated systems.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "moderation_actions"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Each row is a single enforcement action on a piece of content or user account.
 *   - Links to the queue item that prompted the action and optionally to the
 *     response template used.
 *   - Supports graduated enforcement from gentle (label, approve) through
 *     moderate (warn, mute) to severe (ban).
 *   - moderatorId is null for automated actions. isAutomated tracks whether
 *     the action was triggered by a rule (DSA transparency requirement).
 *   - Actions are immutable — no updatedAt.
 */

export const MODERATION_ACTION_TYPE = /** @type {const} */ ({
  APPROVE:  "approve",
  REMOVE:   "remove",
  WARN:     "warn",
  MUTE:     "mute",
  BAN:      "ban",
  RESTRICT: "restrict",
  ESCALATE: "escalate",
  LABEL:    "label",
});

export const MODERATION_ACTION_TARGET_TYPE = /** @type {const} */ ({
  CONTENT: "content",
  USER:    "user",
  ACCOUNT: "account",
});

/**
 * @typedef {Object} ModerationActionDocument
 * @property {string}         id                    - Document ID (from snapshot.id).
 * @property {string|null}    queueItemId           - FK → moderation_queue_items. The queue item that prompted this action. Null for proactive actions.
 * @property {string|null}    moderatorId           - FK → users. Who took this action. Null = automated action.
 * @property {typeof MODERATION_ACTION_TYPE[keyof typeof MODERATION_ACTION_TYPE]} actionType - Enforcement level.
 * @property {typeof MODERATION_ACTION_TARGET_TYPE[keyof typeof MODERATION_ACTION_TARGET_TYPE]} targetType - What the action applies to.
 * @property {string}         targetId              - ID of the action target. String for external ID support.
 * @property {string|null}    reason                - Moderator's explanation of why this action was taken.
 * @property {string|null}    violationCategoryId   - FK → violation_categories. What policy category was violated.
 * @property {string|null}    responseTemplateId    - FK → response_templates. Canned response used, if any.
 * @property {boolean}        isAutomated           - Whether this action was taken by an automated system.
 * @property {Object|null}    metadata              - Action-specific details (e.g., ban duration, label text).
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ModerationActionDocument, "id" | "createdAt">} fields
 * @returns {Omit<ModerationActionDocument, "id">}
 */
export function createModerationAction(fields) {
  return {
    queueItemId:         fields.queueItemId         ?? null,
    moderatorId:         fields.moderatorId          ?? null,
    actionType:          fields.actionType,
    targetType:          fields.targetType,
    targetId:            fields.targetId,
    reason:              fields.reason               ?? null,
    violationCategoryId: fields.violationCategoryId  ?? null,
    responseTemplateId:  fields.responseTemplateId   ?? null,
    isAutomated:         fields.isAutomated          ?? false,
    metadata:            fields.metadata             ?? null,
    createdAt:           Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("moderation_actions").withConverter(moderationActionConverter)
 */
export const moderationActionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                   snapshot.id,
      queueItemId:          data.queueItemId         ?? null,
      moderatorId:          data.moderatorId          ?? null,
      actionType:           data.actionType,
      targetType:           data.targetType,
      targetId:             data.targetId,
      reason:               data.reason               ?? null,
      violationCategoryId:  data.violationCategoryId  ?? null,
      responseTemplateId:   data.responseTemplateId   ?? null,
      isAutomated:          data.isAutomated,
      metadata:             data.metadata             ?? null,
      createdAt:            data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - moderation_actions.targetType ASC
 *     moderation_actions.targetId   ASC
 *     — "All actions on this specific content/user."
 *
 * Single-field:
 *   - moderation_actions.queueItemId         ASC  — "All actions taken on this queue item."
 *   - moderation_actions.moderatorId          ASC  — "All actions by this moderator."
 *   - moderation_actions.actionType           ASC  — "All bans" or "all removals."
 *   - moderation_actions.violationCategoryId  ASC  — "All actions for a violation category."
 *   - moderation_actions.isAutomated          ASC  — "All automated actions" for DSA reporting.
 *   - moderation_actions.createdAt            DESC — Time-range queries, metrics, and reporting.
 */
