// user_trust_scores: User reputation tracking in the moderation system.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "user_trust_scores"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - One trust score record per user (userId is unique).
 *   - trustLevel is a discrete tier for access-control decisions;
 *     trustScore is a continuous 0.00–1.00 value updated algorithmically.
 *   - flagAccuracy caches reports_upheld / total_reports_filed to weight
 *     the user's future reports.
 *   - No createdAt — the record is created once and only updated thereafter.
 */

export const TRUST_LEVEL = /** @type {const} */ ({
  NEW: "new",
  BASIC: "basic",
  MEMBER: "member",
  TRUSTED: "trusted",
  VETERAN: "veteran",
});

/**
 * @typedef {Object} UserTrustScoreDocument
 * @property {string}         id                 - Document ID (from snapshot.id).
 * @property {string}         userId             - FK → users. One trust score per user.
 * @property {typeof TRUST_LEVEL[keyof typeof TRUST_LEVEL]} trustLevel - Discrete trust tier.
 * @property {number}         trustScore         - Continuous score 0.00–1.00.
 * @property {number}         totalReportsFiled  - Total reports this user has submitted.
 * @property {number}         reportsUpheld      - Reports that led to enforcement action.
 * @property {number}         reportsDismissed   - Reports that were dismissed.
 * @property {number}         flagAccuracy       - Cached upheld / total ratio.
 * @property {number}         contentViolations  - Times this user's content was actioned.
 * @property {import("firebase/firestore").Timestamp|null} lastViolationAt - When the most recent violation occurred.
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<UserTrustScoreDocument, "id" | "updatedAt">} fields
 * @returns {Omit<UserTrustScoreDocument, "id">}
 */
export function createUserTrustScore(fields) {
  return {
    userId:            fields.userId,
    trustLevel:        fields.trustLevel        ?? TRUST_LEVEL.NEW,
    trustScore:        fields.trustScore        ?? 0.5,
    totalReportsFiled: fields.totalReportsFiled ?? 0,
    reportsUpheld:     fields.reportsUpheld     ?? 0,
    reportsDismissed:  fields.reportsDismissed  ?? 0,
    flagAccuracy:      fields.flagAccuracy      ?? 0.5,
    contentViolations: fields.contentViolations ?? 0,
    lastViolationAt:   fields.lastViolationAt   ?? null,
    updatedAt:         Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("user_trust_scores").withConverter(userTrustScoreConverter)
 */
export const userTrustScoreConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                snapshot.id,
      userId:            data.userId,
      trustLevel:        data.trustLevel,
      trustScore:        data.trustScore,
      totalReportsFiled: data.totalReportsFiled,
      reportsUpheld:     data.reportsUpheld,
      reportsDismissed:  data.reportsDismissed,
      flagAccuracy:      data.flagAccuracy,
      contentViolations: data.contentViolations,
      lastViolationAt:   data.lastViolationAt   ?? null,
      updatedAt:         data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - user_trust_scores.trustLevel ASC  — "All new users" or "all trusted users."
 *   - user_trust_scores.trustScore ASC  — Score-based queries for trust thresholds.
 */
