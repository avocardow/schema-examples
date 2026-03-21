// role_permissions: Junction collection linking roles to permissions.
// A role can have many permissions; a permission can belong to many roles.
// Pure join — no extra fields needed.
// See README.md for full design rationale.

/**
 * Collection: "role_permissions"
 * Document ID: Firestore auto-generated or UUID
 *
 * Firestore has no composite primary key, so uniqueness on (roleId, permissionId) must be
 * enforced via a transaction or a deterministic document ID (e.g., `${roleId}_${permissionId}`).
 * Using a deterministic ID is the recommended approach — it makes idempotent writes trivial.
 *
 * Security notes:
 *   - Restrict writes to admins only via Security Rules.
 *   - When a role is deleted, cascade-delete its role_permissions documents in the same batch.
 *   - When a permission is deleted, cascade-delete its role_permissions documents as well.
 */

/**
 * @typedef {Object} RolePermissionDocument
 * @property {string}    roleId        - Reference to the roles document.
 * @property {string}    permissionId  - Reference to the permissions document.
 */

/**
 * Returns a deterministic document ID for a (roleId, permissionId) pair.
 * Use this as the document ID to enforce uniqueness without a transaction.
 *
 * @param {string} roleId
 * @param {string} permissionId
 * @returns {string}
 */
export function rolePermissionDocId(roleId, permissionId) {
  return `${roleId}_${permissionId}`;
}

/**
 * @param {{ roleId: string; permissionId: string }} fields
 * @returns {Omit<RolePermissionDocument, "id">}
 */
export function createRolePermission(fields) {
  return {
    roleId:       fields.roleId,
    permissionId: fields.permissionId,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("role_permissions").withConverter(rolePermissionConverter)
 */
export const rolePermissionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      roleId:       data.roleId,
      permissionId: data.permissionId,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - role_permissions.roleId        ASC  — "What permissions does this role have?"
 *   - role_permissions.permissionId  ASC  — "Which roles have this permission?" (reverse lookup).
 */
