// strikes: Accumulated violations with configurable expiry.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "strikes"
 * Document ID: Firestore auto-generated
 *
 * Design notes:
 *   - YouTube-style strike system with configurable expiry.
 *   - Strikes accumulate over time; exceeding a threshold triggers automatic
 *     escalation (e.g., 3 active strikes → temporary ban).
 *   - Strikes can expire after a configured period if no repeat violations occur.
 *   - Distinct from restrictions: a strike is a permanent record of a violation,
 *     while a restriction is an active enforcement.
 */

export const STRIKE_SEVERITY = /** @type {const} */ ({
  MINOR: "minor",
  MODERATE: "moderate",
  SEVERE: "severe",
});

export const STRIKE_RESOLUTION = /** @type {const} */ ({
  ACTIVE: "active",
  EXPIRED: "expired",
  APPEALED_OVERTURNED: "appealed_overturned",
});

/**
 * @typedef {Object} StrikeDocument
 * @property {string}              id
 * @property {string}              userId               - FK → users
 * @property {string}              moderationActionId   - FK → moderation_actions
 * @property {string|null}         violationCategoryId  - FK → violation_categories
 * @property {typeof STRIKE_SEVERITY[keyof typeof STRIKE_SEVERITY]} severity
 * @property {import("firebase/firestore").Timestamp}      issuedAt
 * @property {import("firebase/firestore").Timestamp|null} expiresAt
 * @property {boolean}             isActive
 * @property {typeof STRIKE_RESOLUTION[keyof typeof STRIKE_RESOLUTION]} resolution
 * @property {import("firebase/firestore").Timestamp}      createdAt
 */

/**
 * @param {Omit<StrikeDocument, "id" | "issuedAt" | "createdAt">} fields
 * @returns {Omit<StrikeDocument, "id">}
 */
export function createStrike(fields) {
  return {
    userId:              fields.userId,
    moderationActionId:  fields.moderationActionId,
    violationCategoryId: fields.violationCategoryId ?? null,
    severity:            fields.severity            ?? STRIKE_SEVERITY.MODERATE,
    issuedAt:            Timestamp.now(),
    expiresAt:           fields.expiresAt           ?? null,
    isActive:            fields.isActive            ?? true,
    resolution:          fields.resolution          ?? STRIKE_RESOLUTION.ACTIVE,
    createdAt:           Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("strikes").withConverter(strikeConverter)
 */
export const strikeConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:                  snapshot.id,
      userId:              data.userId,
      moderationActionId:  data.moderationActionId,
      violationCategoryId: data.violationCategoryId ?? null,
      severity:            data.severity,
      issuedAt:            data.issuedAt,
      expiresAt:           data.expiresAt           ?? null,
      isActive:            data.isActive,
      resolution:          data.resolution,
      createdAt:           data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - strikes.userId    ASC
 *     strikes.isActive  ASC
 *     — "All active strikes for this user" — threshold check.
 *
 *   - strikes.expiresAt ASC
 *     strikes.isActive  ASC
 *     — Background job: expire strikes past their expiry date.
 *
 * Single-field:
 *   - strikes.moderationActionId   ASC  — "Strike for this action."
 *   - strikes.violationCategoryId  ASC  — "All strikes for a given violation category."
 *   - strikes.resolution           ASC  — "All overturned strikes" for reporting.
 */
