// moderation_queue_items: Central moderation queue for content review.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const QUEUE_ITEM_CONTENT_TYPE = /** @type {const} */ ({
  POST:    "post",
  COMMENT: "comment",
  MESSAGE: "message",
  USER:    "user",
  MEDIA:   "media",
});

export const QUEUE_ITEM_SOURCE = /** @type {const} */ ({
  USER_REPORT:    "user_report",
  AUTO_DETECTION: "auto_detection",
  MANUAL:         "manual",
});

export const QUEUE_ITEM_STATUS = /** @type {const} */ ({
  PENDING:   "pending",
  IN_REVIEW: "in_review",
  RESOLVED:  "resolved",
  ESCALATED: "escalated",
});

export const QUEUE_ITEM_PRIORITY = /** @type {const} */ ({
  LOW:      "low",
  MEDIUM:   "medium",
  HIGH:     "high",
  CRITICAL: "critical",
});

export const QUEUE_ITEM_RESOLUTION = /** @type {const} */ ({
  APPROVED:  "approved",
  REMOVED:   "removed",
  ESCALATED: "escalated",
});

/**
 * @typedef {Object} ModerationQueueItemDocument
 * @property {string}                                                          id                  - Document ID (from snapshot.id).
 * @property {typeof QUEUE_ITEM_CONTENT_TYPE[keyof typeof QUEUE_ITEM_CONTENT_TYPE]} contentType     - What type of content is being reviewed.
 * @property {string}                                                          contentId           - ID of the flagged content. String, not UUID — supports external ID formats.
 * @property {typeof QUEUE_ITEM_SOURCE[keyof typeof QUEUE_ITEM_SOURCE]}        source              - How this item entered the queue.
 * @property {typeof QUEUE_ITEM_STATUS[keyof typeof QUEUE_ITEM_STATUS]}        status              - Current review status.
 * @property {typeof QUEUE_ITEM_PRIORITY[keyof typeof QUEUE_ITEM_PRIORITY]}    priority            - Queue ordering priority.
 * @property {string|null}                                                     assignedModeratorId - FK → users. Moderator currently reviewing this item.
 * @property {Object|null}                                                     contentSnapshot     - Frozen copy of the content at time of flagging.
 * @property {number}                                                          reportCount         - Number of user reports linked to this item.
 * @property {typeof QUEUE_ITEM_RESOLUTION[keyof typeof QUEUE_ITEM_RESOLUTION]|null} resolution    - Final outcome. Null = not yet resolved.
 * @property {import("firebase/firestore").Timestamp|null}                     resolvedAt          - When the item was resolved. Null = still open.
 * @property {string|null}                                                     resolvedBy          - FK → users. Moderator who resolved this item.
 * @property {import("firebase/firestore").Timestamp}                          createdAt
 * @property {import("firebase/firestore").Timestamp}                          updatedAt
 */

/**
 * @param {Omit<ModerationQueueItemDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ModerationQueueItemDocument, "id">}
 */
export function createModerationQueueItem(fields) {
  return {
    contentType:         fields.contentType,
    contentId:           fields.contentId,
    source:              fields.source,
    status:              fields.status              ?? QUEUE_ITEM_STATUS.PENDING,
    priority:            fields.priority            ?? QUEUE_ITEM_PRIORITY.MEDIUM,
    assignedModeratorId: fields.assignedModeratorId ?? null,
    contentSnapshot:     fields.contentSnapshot     ?? null,
    reportCount:         fields.reportCount         ?? 0,
    resolution:          fields.resolution          ?? null,
    resolvedAt:          fields.resolvedAt          ?? null,
    resolvedBy:          fields.resolvedBy          ?? null,
    createdAt:           Timestamp.now(),
    updatedAt:           Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("moderation_queue_items").withConverter(moderationQueueItemConverter)
 */
export const moderationQueueItemConverter = {
  /** @param {Omit<ModerationQueueItemDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                  snapshot.id,
      contentType:         data.contentType,
      contentId:           data.contentId,
      source:              data.source,
      status:              data.status,
      priority:            data.priority,
      assignedModeratorId: data.assignedModeratorId ?? null,
      contentSnapshot:     data.contentSnapshot     ?? null,
      reportCount:         data.reportCount,
      resolution:          data.resolution           ?? null,
      resolvedAt:          data.resolvedAt           ?? null,
      resolvedBy:          data.resolvedBy           ?? null,
      createdAt:           data.createdAt,
      updatedAt:           data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - moderation_queue_items.status   ASC
 *     moderation_queue_items.priority ASC
 *     moderation_queue_items.createdAt ASC
 *     — Primary queue query: pending items by priority, oldest first.
 *
 *   - moderation_queue_items.contentType ASC
 *     moderation_queue_items.contentId   ASC
 *     — "All queue items for this specific content."
 *
 * Single-field:
 *   - moderation_queue_items.assignedModeratorId ASC — "My assigned items."
 *   - moderation_queue_items.source              ASC — "All auto-detected items" vs "all user-reported items."
 *   - moderation_queue_items.status              ASC — "All pending items."
 *   - moderation_queue_items.resolvedAt          ASC — Time-range queries and metrics.
 */
