// moderation_action_log: Immutable audit trail of moderation events.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "moderation_action_log"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Append-only. No updatedAt — once logged, never changed.
 *   - actionType and targetType are plain strings, not enums — the audit log
 *     should accept any event type without requiring schema migration.
 *   - targetId is intentionally not a foreign key — the target entity may be
 *     permanently deleted. targetType contextualises what targetId refers to.
 */

/**
 * @typedef {Object} ModerationActionLogDocument
 * @property {string}         id          - Document ID (from snapshot.id).
 * @property {string}         actorId     - FK → users. Who performed the action.
 * @property {string}         actionType  - What happened (e.g., "report_created", "action_taken", "appeal_decided").
 * @property {string}         targetType  - What entity the action was on (e.g., "queue_item", "report", "user", "moderation_rule", "policy").
 * @property {string}         targetId    - ID of the target entity. Not a FK — target may be permanently deleted.
 * @property {Object|null}    details     - Event-specific context (e.g., {action_type: "ban", reason: "...", duration: "24h"}).
 * @property {string|null}    ipAddress   - Client IP address for security audit.
 * @property {Timestamp}      createdAt   - When the action occurred. Immutable.
 */

/**
 * @param {Omit<ModerationActionLogDocument, "id" | "createdAt">} fields
 * @returns {Omit<ModerationActionLogDocument, "id">}
 */
export function createModerationActionLog(fields) {
  return {
    actorId:    fields.actorId,
    actionType: fields.actionType,
    targetType: fields.targetType,
    targetId:   fields.targetId,
    details:    fields.details   ?? null,
    ipAddress:  fields.ipAddress ?? null,
    createdAt:  Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("moderation_action_log").withConverter(moderationActionLogConverter)
 */
export const moderationActionLogConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      actorId:    data.actorId,
      actionType: data.actionType,
      targetType: data.targetType,
      targetId:   data.targetId,
      details:    data.details   ?? null,
      ipAddress:  data.ipAddress ?? null,
      createdAt:  data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - moderation_action_log.actorId     ASC  — "All actions by this moderator."
 *   - moderation_action_log.actionType  ASC  — "All appeal decisions" or "all bans."
 *   - moderation_action_log.createdAt   ASC  — Time-range queries and retention.
 *
 * Composite:
 *   - moderation_action_log.targetType  ASC
 *     moderation_action_log.targetId    ASC
 *     — "All log entries for this specific entity."
 */
