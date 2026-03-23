// message_reports: reports submitted by users flagging messages for review.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const MESSAGE_REPORT_REASON = /** @type {const} */ ({
  SPAM: "spam",
  HARASSMENT: "harassment",
  HATE_SPEECH: "hate_speech",
  VIOLENCE: "violence",
  MISINFORMATION: "misinformation",
  NSFW: "nsfw",
  OTHER: "other",
});

export const MESSAGE_REPORT_STATUS = /** @type {const} */ ({
  PENDING: "pending",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
});

/**
 * @typedef {Object} MessageReportDocument
 * @property {string} id
 * @property {string} messageId - FK → messages
 * @property {string} reporterId - FK → users
 * @property {typeof MESSAGE_REPORT_REASON[keyof typeof MESSAGE_REPORT_REASON]} reason
 * @property {string | null} description
 * @property {typeof MESSAGE_REPORT_STATUS[keyof typeof MESSAGE_REPORT_STATUS]} status
 * @property {string | null} reviewedBy - FK → users
 * @property {import("firebase/firestore").Timestamp | null} reviewedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createMessageReport(fields) {
  return {
    messageId: fields.messageId,
    reporterId: fields.reporterId,
    reason: fields.reason,
    description: fields.description ?? null,
    status: fields.status ?? "pending",
    reviewedBy: fields.reviewedBy ?? null,
    reviewedAt: fields.reviewedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const messageReportConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      messageId: data.messageId,
      reporterId: data.reporterId,
      reason: data.reason,
      description: data.description ?? null,
      status: data.status,
      reviewedBy: data.reviewedBy ?? null,
      reviewedAt: data.reviewedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - status      ASC
 *   - messageId   ASC
 *   - reporterId  ASC
 *   - reviewedBy  ASC
 *
 * Composite indexes:
 *   - messageId ASC, reporterId ASC  (enforces composite unique constraint)
 *   - status ASC, createdAt DESC
 *   - messageId ASC, status ASC
 */
