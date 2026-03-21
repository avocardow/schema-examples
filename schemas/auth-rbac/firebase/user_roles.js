// user_roles: Assigns environment-level (app-wide) roles to users.
// For organization-scoped roles, see organization_members.roleId instead.
// This collection is for roles like "super admin" or "platform support" that apply across
// the entire application, not within a specific org.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "user_roles"
 * Document ID: Firestore auto-generated or UUID
 *
 * A deterministic document ID (e.g., `${userId}_${roleId}`) is recommended to enforce
 * uniqueness on the (userId, roleId) pair without a transaction.
 *
 * Security notes:
 *   - Only environment-scoped roles (roles.scope="environment") belong here.
 *   - Restrict writes to admins only. Track who granted each role via assignedBy.
 *   - Before deleting a role, check user_roles for any active assignments.
 */

/**
 * @typedef {Object} UserRoleDocument
 * @property {string}      userId      - Reference to the users document.
 * @property {string}      roleId      - Reference to the roles document (must be scope="environment").
 * @property {string|null} assignedBy  - User ID of who granted this role. Null if system-assigned.
 * @property {Timestamp}   createdAt
 */

/**
 * Returns a deterministic document ID for a (userId, roleId) pair.
 * Use this as the document ID to enforce uniqueness.
 *
 * @param {string} userId
 * @param {string} roleId
 * @returns {string}
 */
export function userRoleDocId(userId, roleId) {
  return `${userId}_${roleId}`;
}

/**
 * @param {{ userId: string; roleId: string; assignedBy?: string | null }} fields
 * @returns {Omit<UserRoleDocument, "id">}
 */
export function createUserRole(fields) {
  return {
    userId:     fields.userId,
    roleId:     fields.roleId,
    assignedBy: fields.assignedBy ?? null,
    createdAt:  Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("user_roles").withConverter(userRoleConverter)
 */
export const userRoleConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      userId:     data.userId,
      roleId:     data.roleId,
      assignedBy: data.assignedBy ?? null,
      createdAt:  data.createdAt,             // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - user_roles.userId  ASC  — "What roles does this user have?"
 *   - user_roles.roleId  ASC  — "Which users have the admin role?"
 */
