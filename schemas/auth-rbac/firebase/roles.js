// roles: Named sets of permissions. Slug-based for readable code ("admin", "org:editor").
// Supports two-tier scoping: environment-level (app-wide) and organization-scoped roles.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "roles"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - System roles (isSystem=true) must not be deleted. Enforce in Security Rules or server logic.
 *   - slug must be unique — enforce via transaction before writing.
 *   - Deleting a role that is assigned to users must be blocked; check user_roles first.
 */

/**
 * @typedef {"environment"|"organization"} RoleScope
 */

export const ROLE_SCOPES = /** @type {const} */ ({
  ENVIRONMENT:  "environment",
  ORGANIZATION: "organization",
});

/**
 * @typedef {Object} RoleDocument
 * @property {string}    slug        - Human-readable key (e.g., "admin", "org:editor", "viewer"). Used in code.
 * @property {string}    name        - Display name for admin UIs (e.g., "Administrator", "Organization Editor").
 * @property {string|null} description - Explain what this role is for. Shown in role management UI.
 * @property {RoleScope} scope       - "environment" = app-wide. "organization" = only within an org.
 * @property {boolean}   isSystem    - System roles are created at setup and cannot be deleted.
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<RoleDocument, "isSystem" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<RoleDocument, "id">}
 */
export function createRole(fields) {
  const now = Timestamp.now();
  return {
    slug:        fields.slug,
    name:        fields.name,
    description: fields.description ?? null,
    scope:       fields.scope,
    isSystem:    false,
    createdAt:   now,
    updatedAt:   now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("roles").withConverter(roleConverter)
 */
export const roleConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      slug:        data.slug,
      name:        data.name,
      description: data.description ?? null,
      scope:       data.scope,
      isSystem:    data.isSystem    ?? false,
      createdAt:   data.createdAt,            // Timestamp
      updatedAt:   data.updatedAt,            // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - roles.slug   ASC  — Must be unique; enforce via transaction before write.
 *   - roles.scope  ASC  — "List all organization-scoped roles."
 */
