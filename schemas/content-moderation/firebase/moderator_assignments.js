// moderator_assignments: Default routing of content to moderators.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "moderator_assignments"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - scope discriminates what this assignment covers: community, channel, or category.
 *     scopeId is polymorphic — it references a community, channel, or violation category
 *     depending on scope. Not enforced as a FK.
 *   - assignedAt is a separate Timestamp from createdAt to allow backdating or
 *     re-dating assignments independently of document creation.
 *   - Unique constraint (moderatorId, scope, scopeId) must be enforced at the
 *     application layer — Firestore has no built-in uniqueness beyond document IDs.
 */

export const MODERATOR_ASSIGNMENT_SCOPE = /** @type {const} */ ({
  COMMUNITY: "community",
  CHANNEL: "channel",
  CATEGORY: "category",
});

export const MODERATOR_ASSIGNMENT_ROLE = /** @type {const} */ ({
  MODERATOR: "moderator",
  SENIOR_MODERATOR: "senior_moderator",
  ADMIN: "admin",
});

/**
 * @typedef {Object} ModeratorAssignmentDocument
 * @property {string}  id           - Document ID (from snapshot.id).
 * @property {string}  moderatorId  - FK → users. The assigned moderator.
 * @property {typeof MODERATOR_ASSIGNMENT_SCOPE[keyof typeof MODERATOR_ASSIGNMENT_SCOPE]} scope
 *   - What this assignment covers: "community", "channel", or "category".
 * @property {string}  scopeId      - ID of the community, channel, or violation category.
 * @property {typeof MODERATOR_ASSIGNMENT_ROLE[keyof typeof MODERATOR_ASSIGNMENT_ROLE]} role
 *   - Authority level: "moderator", "senior_moderator", or "admin".
 * @property {boolean} isActive     - Whether this assignment is currently active.
 * @property {import("firebase/firestore").Timestamp} assignedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ModeratorAssignmentDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ModeratorAssignmentDocument, "id">}
 */
export function createModeratorAssignment(fields) {
  return {
    moderatorId: fields.moderatorId,
    scope:       fields.scope,
    scopeId:     fields.scopeId,
    role:        fields.role ?? MODERATOR_ASSIGNMENT_ROLE.MODERATOR,
    isActive:    fields.isActive ?? true,
    assignedAt:  fields.assignedAt ?? Timestamp.now(),
    createdAt:   Timestamp.now(),
    updatedAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("moderator_assignments").withConverter(moderatorAssignmentConverter)
 */
export const moderatorAssignmentConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      moderatorId: data.moderatorId,
      scope:       data.scope,
      scopeId:     data.scopeId,
      role:        data.role,
      isActive:    data.isActive,
      assignedAt:  data.assignedAt,
      createdAt:   data.createdAt,
      updatedAt:   data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - moderator_assignments.moderatorId ASC
 *     moderator_assignments.scope       ASC
 *     moderator_assignments.scopeId     ASC
 *     — Unique constraint: one assignment per moderator per scope entity.
 *
 *   - moderator_assignments.scope   ASC
 *     moderator_assignments.scopeId ASC
 *     — "All moderators for this community/channel/category."
 *
 * Single-field:
 *   - moderator_assignments.moderatorId ASC  — "All assignments for this moderator."
 *   - moderator_assignments.isActive    ASC  — "All active assignments."
 */
