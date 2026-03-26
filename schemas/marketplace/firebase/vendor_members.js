// vendor_members: Team membership and role assignments for vendor accounts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const VENDOR_MEMBER_ROLE = /** @type {const} */ ({
  OWNER: "owner",
  ADMIN: "admin",
  EDITOR: "editor",
  VIEWER: "viewer",
});

/**
 * @typedef {Object} VendorMemberDocument
 * @property {string} id
 * @property {string} vendorId - FK → vendors
 * @property {string} userId - FK → users
 * @property {typeof VENDOR_MEMBER_ROLE[keyof typeof VENDOR_MEMBER_ROLE]} role
 * @property {string|null} invitedBy - FK → users
 * @property {Timestamp|null} joinedAt
 * @property {Timestamp} createdAt
 * @property {Timestamp} updatedAt
 */

/**
 * @param {Omit<VendorMemberDocument, "id" | "createdAt" | "updatedAt">} data
 * @returns {Omit<VendorMemberDocument, "id">}
 */
export function createVendorMember(data) {
  return {
    vendorId: data.vendorId,
    userId: data.userId,
    role: data.role ?? VENDOR_MEMBER_ROLE.VIEWER,
    invitedBy: data.invitedBy ?? null,
    joinedAt: data.joinedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const vendorMemberConverter = {
  toFirestore(member) {
    const { id, ...data } = member;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      vendorId: data.vendorId,
      userId: data.userId,
      role: data.role,
      invitedBy: data.invitedBy ?? null,
      joinedAt: data.joinedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

// Suggested indexes:
// - vendorId ASC, userId ASC (composite)
// - userId ASC
