// post_reports: user-submitted reports of posts for moderation review.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const REPORT_REASONS = /** @type {const} */ ({
  SPAM: "spam",
  HARASSMENT: "harassment",
  HATE_SPEECH: "hate_speech",
  VIOLENCE: "violence",
  MISINFORMATION: "misinformation",
  NSFW: "nsfw",
  OTHER: "other",
});

export const REPORT_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  REVIEWED: "reviewed",
  RESOLVED: "resolved",
  DISMISSED: "dismissed",
});

/**
 * @typedef {Object} PostReportDocument
 * @property {string} id
 * @property {string} postId - FK → posts
 * @property {string} reporterId - FK → users
 * @property {typeof REPORT_REASONS[keyof typeof REPORT_REASONS]} reason
 * @property {string | null} description
 * @property {typeof REPORT_STATUSES[keyof typeof REPORT_STATUSES]} status
 * @property {string | null} reviewedBy - FK → users
 * @property {import("firebase/firestore").Timestamp | null} reviewedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<PostReportDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<PostReportDocument, "id">}
 */
export function createPostReport(fields) {
  return {
    postId: fields.postId,
    reporterId: fields.reporterId,
    reason: fields.reason,
    description: fields.description ?? null,
    status: fields.status ?? REPORT_STATUSES.PENDING,
    reviewedBy: fields.reviewedBy ?? null,
    reviewedAt: fields.reviewedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const postReportConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      postId: data.postId,
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
 *   - postId     ASC
 *   - reporterId ASC
 *   - reason     ASC
 *   - status     ASC
 *   - reviewedBy ASC
 *
 * Composite indexes:
 *   - status ASC, createdAt ASC
 *   - status ASC, reason ASC, createdAt ASC
 *   - postId ASC, status ASC
 */
