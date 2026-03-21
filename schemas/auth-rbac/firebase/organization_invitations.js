// organization_invitations: Pending invitations to join an organization.
// Separate from organization_members because the invitee may not have a user account yet.
// Create the member document only after the invitation is accepted.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "organization_invitations"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - tokenHash stores the SHA-256 hash of the raw invitation token sent in the invite email.
 *   - tokenHash must be globally unique — enforce via transaction before writing.
 *   - Expired invitations (expiresAt < now) must be rejected server-side before acceptance.
 *   - Only pending invitations should be actionable; check status before processing.
 */

/**
 * @typedef {"pending"|"accepted"|"expired"|"revoked"} InvitationStatus
 */

export const INVITATION_STATUSES = /** @type {const} */ ({
  PENDING:  "pending",
  ACCEPTED: "accepted",
  EXPIRED:  "expired",
  REVOKED:  "revoked",
});

/**
 * @typedef {Object} OrganizationInvitationDocument
 * @property {string}            organizationId - Reference to the organizations document.
 * @property {string}            email          - Invitee's email. They may not have an account yet.
 * @property {string}            roleId         - The role the invitee will receive upon acceptance.
 * @property {InvitationStatus}  status         - Lifecycle: pending → accepted / expired / revoked.
 * @property {string}            tokenHash      - SHA-256 hash of the raw invitation token.
 * @property {string|null}       inviterId      - User ID who sent the invitation. Null if system-generated.
 * @property {Timestamp}         expiresAt      - Typically 7 days. After this, a new invitation must be sent.
 * @property {Timestamp|null}    acceptedAt     - When the invitee accepted.
 * @property {Timestamp}         createdAt
 */

/**
 * @param {Omit<OrganizationInvitationDocument, "status" | "acceptedAt" | "createdAt">} fields
 * @returns {Omit<OrganizationInvitationDocument, "id">}
 */
export function createOrganizationInvitation(fields) {
  return {
    organizationId: fields.organizationId,
    email:          fields.email,
    roleId:         fields.roleId,
    status:         "pending",
    tokenHash:      fields.tokenHash,
    inviterId:      fields.inviterId ?? null,
    expiresAt:      fields.expiresAt,
    acceptedAt:     null,
    createdAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("organization_invitations").withConverter(organizationInvitationConverter)
 */
export const organizationInvitationConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      organizationId: data.organizationId,
      email:          data.email,
      roleId:         data.roleId,
      status:         data.status         ?? "pending",
      tokenHash:      data.tokenHash,
      inviterId:      data.inviterId      ?? null,
      expiresAt:      data.expiresAt,                  // Timestamp
      acceptedAt:     data.acceptedAt     ?? null,     // Timestamp | null
      createdAt:      data.createdAt,                  // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - organization_invitations.tokenHash  ASC  — Must be unique; enforce via transaction before write.
 *   - organization_invitations.email      ASC  — "Does this email have any pending invitations?" (checked at signup).
 *
 * Composite:
 *   - organization_invitations.organizationId  ASC
 *     organization_invitations.status          ASC
 *     — "List pending invitations for this org."
 */
