// teams: Sub-groups within an organization. Useful for department-level access control,
// notification routing, or project-based grouping. Slug is unique within an org, not globally.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "teams"
 * Document ID: Firestore auto-generated or UUID
 *
 * Firestore has no composite unique constraint, so uniqueness on (organizationId, slug) must be
 * enforced via a transaction or a deterministic document ID (e.g., `${organizationId}_${slug}`).
 *
 * Security notes:
 *   - slug is unique within the organization, not globally. Enforce via transaction before write.
 *   - Before deleting a team, cascade-delete its team_members documents in the same batch.
 *   - Restrict team creation/deletion to org admins or users with the appropriate permission.
 */

/**
 * @typedef {Object} TeamDocument
 * @property {string}    organizationId  - Reference to the organizations document.
 * @property {string}    name            - Display name (e.g., "Engineering", "Design").
 * @property {string}    slug            - URL-safe identifier, unique within the org (e.g., "engineering").
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * Returns a deterministic document ID for an (organizationId, slug) pair.
 * Use this as the document ID to enforce uniqueness within an org without a transaction.
 *
 * @param {string} organizationId
 * @param {string} slug
 * @returns {string}
 */
export function teamDocId(organizationId, slug) {
  return `${organizationId}_${slug}`;
}

/**
 * @param {Omit<TeamDocument, "createdAt" | "updatedAt">} fields
 * @returns {Omit<TeamDocument, "id">}
 */
export function createTeam(fields) {
  const now = Timestamp.now();
  return {
    organizationId: fields.organizationId,
    name:           fields.name,
    slug:           fields.slug,
    createdAt:      now,
    updatedAt:      now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("teams").withConverter(teamConverter)
 */
export const teamConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId,
      name:           data.name,
      slug:           data.slug,
      createdAt:      data.createdAt,      // Timestamp
      updatedAt:      data.updatedAt,      // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - teams.organizationId  ASC  — "List all teams in this organization."
 *
 * Composite:
 *   - teams.organizationId  ASC
 *     teams.slug            ASC
 *     — Enforce uniqueness within an org. Also supports lookup by org + slug.
 */
