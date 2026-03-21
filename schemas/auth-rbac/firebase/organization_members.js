// organization_members: Links users to organizations with a role.
// The primary multi-tenancy junction collection. roleId must reference a role with scope="organization".
// Create this document only when an invitation is accepted (not when it is sent).
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "organization_members"
 * Document ID: Firestore auto-generated or UUID
 *
 * A deterministic document ID (e.g., `${organizationId}_${userId}`) is recommended to enforce
 * uniqueness on the (organizationId, userId) pair without a transaction.
 *
 * Security notes:
 *   - roleId must reference a role with scope="organization". Validate server-side.
 *   - Directory-managed memberships (directoryManaged=true) should not be editable via your app UI.
 *   - customAttributes may contain org-specific PII; restrict client access as appropriate.
 */

/**
 * @typedef {"active"|"inactive"} MemberStatus
 */

export const MEMBER_STATUSES = /** @type {const} */ ({
  ACTIVE:   "active",
  INACTIVE: "inactive",
});

/**
 * @typedef {Object} OrganizationMemberDocument
 * @property {string}         organizationId      - Reference to the organizations document.
 * @property {string}         userId              - Reference to the users document.
 * @property {string}         roleId              - Reference to the roles document (must be scope="organization").
 * @property {MemberStatus}   status              - "active" = normal member. "inactive" = suspended but not removed.
 * @property {boolean}        directoryManaged    - If true, managed by an external directory (Okta, Azure AD). Not editable via UI.
 * @property {Object|null}    customAttributes    - Org-specific metadata (e.g., department, title within the org).
 * @property {string|null}    invitedBy           - User ID who sent the invitation. Null if system/SCIM-provisioned.
 * @property {Timestamp|null} joinedAt            - When the user accepted the invitation. May differ from createdAt for SCIM members.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * Returns a deterministic document ID for an (organizationId, userId) pair.
 *
 * @param {string} organizationId
 * @param {string} userId
 * @returns {string}
 */
export function organizationMemberDocId(organizationId, userId) {
  return `${organizationId}_${userId}`;
}

/**
 * @param {Omit<OrganizationMemberDocument, "status" | "directoryManaged" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<OrganizationMemberDocument, "id">}
 */
export function createOrganizationMember(fields) {
  const now = Timestamp.now();
  return {
    organizationId:   fields.organizationId,
    userId:           fields.userId,
    roleId:           fields.roleId,
    status:           "active",
    directoryManaged: false,
    customAttributes: fields.customAttributes ?? null,
    invitedBy:        fields.invitedBy        ?? null,
    joinedAt:         fields.joinedAt         ?? null,
    createdAt:        now,
    updatedAt:        now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("organization_members").withConverter(organizationMemberConverter)
 */
export const organizationMemberConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:               snapshot.id,
      organizationId:   data.organizationId,
      userId:           data.userId,
      roleId:           data.roleId,
      status:           data.status             ?? "active",
      directoryManaged: data.directoryManaged   ?? false,
      customAttributes: data.customAttributes   ?? null,
      invitedBy:        data.invitedBy          ?? null,
      joinedAt:         data.joinedAt           ?? null, // Timestamp | null
      createdAt:        data.createdAt,                   // Timestamp
      updatedAt:        data.updatedAt,                   // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - organization_members.userId  ASC  — "Which orgs does this user belong to?"
 *
 * Composite:
 *   - organization_members.organizationId  ASC
 *     organization_members.status          ASC
 *     — "List active members of this org."
 */
