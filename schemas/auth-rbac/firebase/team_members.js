// team_members: Junction collection linking users to teams within an organization.
// Supports a simple team-level role (e.g., "lead", "member") — not a FK to the roles collection.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "team_members"
 * Document ID: Firestore auto-generated or UUID
 *
 * Firestore has no composite unique constraint, so uniqueness on (teamId, userId) must be
 * enforced via a transaction or a deterministic document ID (e.g., `${teamId}_${userId}`).
 * Using a deterministic ID is the recommended approach — it makes idempotent writes trivial.
 *
 * Security notes:
 *   - When a team is deleted, cascade-delete its team_members documents in the same batch.
 *   - When a user is removed from an organization, cascade-delete their team_members too.
 *   - The role field is a simple string label, not a FK to the roles collection.
 *     It controls team-specific behavior (e.g., who can manage the team), not RBAC permissions.
 */

/**
 * @typedef {Object} TeamMemberDocument
 * @property {string}      teamId     - Reference to the teams document.
 * @property {string}      userId     - Reference to the users document.
 * @property {string|null} role       - Simple team role (e.g., "lead", "member"). Not a FK to roles.
 * @property {Timestamp}   createdAt
 */

/**
 * Returns a deterministic document ID for a (teamId, userId) pair.
 * Use this as the document ID to enforce uniqueness without a transaction.
 *
 * @param {string} teamId
 * @param {string} userId
 * @returns {string}
 */
export function teamMemberDocId(teamId, userId) {
  return `${teamId}_${userId}`;
}

/**
 * @param {{ teamId: string; userId: string; role?: string | null }} fields
 * @returns {Omit<TeamMemberDocument, "id">}
 */
export function createTeamMember(fields) {
  return {
    teamId:    fields.teamId,
    userId:    fields.userId,
    role:      fields.role ?? null,
    createdAt: Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("team_members").withConverter(teamMemberConverter)
 */
export const teamMemberConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      teamId:    data.teamId,
      userId:    data.userId,
      role:      data.role   ?? null,
      createdAt: data.createdAt,       // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - team_members.teamId  ASC  — "Who is on this team?"
 *   - team_members.userId  ASC  — "Which teams is this user on?"
 */
