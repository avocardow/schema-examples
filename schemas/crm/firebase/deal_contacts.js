// deal_contacts: join table linking deals to contacts with role designation.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const DEAL_CONTACT_ROLES = /** @type {const} */ ({
  DECISION_MAKER: "decision_maker",
  CHAMPION: "champion",
  INFLUENCER: "influencer",
  END_USER: "end_user",
  OTHER: "other",
});

/**
 * @typedef {Object} DealContactDocument
 * @property {string} id
 * @property {string} dealId - FK → deals
 * @property {string} contactId - FK → contacts
 * @property {typeof DEAL_CONTACT_ROLES[keyof typeof DEAL_CONTACT_ROLES]} role
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<DealContactDocument, "id" | "createdAt">} fields
 * @returns {Omit<DealContactDocument, "id">}
 */
export function createDealContact(fields) {
  return {
    dealId: fields.dealId,
    contactId: fields.contactId,
    role: fields.role ?? DEAL_CONTACT_ROLES.OTHER,
    createdAt: Timestamp.now(),
  };
}

export const dealContactConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      dealId: data.dealId,
      contactId: data.contactId,
      role: data.role,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "deal_contacts"
 *   - dealId ASC, role ASC
 *   - contactId ASC, createdAt DESC
 */
