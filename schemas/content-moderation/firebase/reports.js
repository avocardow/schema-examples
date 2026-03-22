// reports: User-submitted content reports.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "reports"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - One document per report — multiple users can report the same content,
 *     each creating a separate record linked to the same queue item.
 *   - queueItemId and policyId are nullable: set null if the referenced
 *     queue item or policy is deleted, preserving report history.
 *   - No updatedAt — reports are write-once records.
 */

export const REPORT_CONTENT_TYPE = /** @type {const} */ ({
  POST: "post",
  COMMENT: "comment",
  MESSAGE: "message",
  USER: "user",
  MEDIA: "media",
});

export const REPORT_CATEGORY = /** @type {const} */ ({
  SPAM: "spam",
  HARASSMENT: "harassment",
  HATE_SPEECH: "hate_speech",
  VIOLENCE: "violence",
  SEXUAL_CONTENT: "sexual_content",
  ILLEGAL: "illegal",
  MISINFORMATION: "misinformation",
  SELF_HARM: "self_harm",
  OTHER: "other",
});

export const REPORT_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  REVIEWED: "reviewed",
  DISMISSED: "dismissed",
});

/**
 * @typedef {Object} ReportDocument
 * @property {string}      id          - Document ID (from snapshot.id).
 * @property {string}      reporterId  - FK → users. Who submitted this report.
 * @property {typeof REPORT_CONTENT_TYPE[keyof typeof REPORT_CONTENT_TYPE]} contentType - What type of content is being reported.
 * @property {string}      contentId   - ID of the reported content. String for external ID support.
 * @property {string|null} queueItemId - FK → moderation_queue_items. Nullable; set null if queue item is deleted.
 * @property {typeof REPORT_CATEGORY[keyof typeof REPORT_CATEGORY]} category - Reporter-selected reason category.
 * @property {string|null} reasonText  - Free-text explanation from the reporter.
 * @property {string|null} policyId    - FK → moderation_policies. Nullable; set null if policy is deleted.
 * @property {typeof REPORT_STATUS[keyof typeof REPORT_STATUS]} status - pending, reviewed, or dismissed.
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ReportDocument, "id" | "createdAt">} fields
 * @returns {Omit<ReportDocument, "id">}
 */
export function createReport(fields) {
  return {
    reporterId:  fields.reporterId,
    contentType: fields.contentType,
    contentId:   fields.contentId,
    queueItemId: fields.queueItemId ?? null,
    category:    fields.category,
    reasonText:  fields.reasonText  ?? null,
    policyId:    fields.policyId    ?? null,
    status:      fields.status      ?? REPORT_STATUS.PENDING,
    createdAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("reports").withConverter(reportConverter)
 */
export const reportConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      reporterId:  data.reporterId,
      contentType: data.contentType,
      contentId:   data.contentId,
      queueItemId: data.queueItemId ?? null,
      category:    data.category,
      reasonText:  data.reasonText  ?? null,
      policyId:    data.policyId    ?? null,
      status:      data.status,
      createdAt:   data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - reports.queueItemId   ASC  — "All reports linked to this queue item."
 *   - reports.reporterId    ASC  — "All reports submitted by this user."
 *   - reports.status        ASC  — "All pending reports."
 *   - reports.category      ASC  — "All harassment reports."
 *   - reports.createdAt     ASC  — Time-range queries and metrics.
 *
 * Composite:
 *   - reports.contentType   ASC
 *     reports.contentId     ASC
 *     — "All reports for this specific content."
 */
