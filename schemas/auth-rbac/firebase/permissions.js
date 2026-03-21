// permissions: Granular capabilities using "resource:action" naming (e.g., "posts:create").
// Assigned to roles (not directly to users) to keep the RBAC model manageable.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "permissions"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - slug must be unique — enforce via transaction before writing.
 *   - Restrict writes to admins only via Security Rules.
 *   - Permissions are assigned to roles (role_permissions), never directly to users.
 */

/**
 * @typedef {Object} PermissionDocument
 * @property {string}      slug          - Structured key: "resource:action" (e.g., "posts:create", "users:delete").
 * @property {string}      name          - Display name (e.g., "Create Posts").
 * @property {string|null} description
 * @property {string|null} resourceType  - Groups permissions by resource (e.g., "posts", "users", "billing").
 *                                         Useful for building permission UIs: "Posts: ✓ create ✓ read ✗ delete".
 * @property {Timestamp}   createdAt
 */

/**
 * @param {Omit<PermissionDocument, "createdAt">} fields
 * @returns {Omit<PermissionDocument, "id">}
 */
export function createPermission(fields) {
  return {
    slug:         fields.slug,
    name:         fields.name,
    description:  fields.description  ?? null,
    resourceType: fields.resourceType ?? null,
    createdAt:    Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("permissions").withConverter(permissionConverter)
 */
export const permissionConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      slug:         data.slug,
      name:         data.name,
      description:  data.description  ?? null,
      resourceType: data.resourceType ?? null,
      createdAt:    data.createdAt,             // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - permissions.slug          ASC  — Must be unique; enforce via transaction before write.
 *   - permissions.resourceType  ASC  — "List all permissions for the 'posts' resource."
 */
