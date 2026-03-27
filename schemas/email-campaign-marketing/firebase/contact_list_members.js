// contact_list_members: Junction table linking contacts to mailing lists with subscription state.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const CONTACT_LIST_MEMBER_STATUS = /** @type {const} */ ({
  SUBSCRIBED: "subscribed",
  UNSUBSCRIBED: "unsubscribed",
  UNCONFIRMED: "unconfirmed",
});

/**
 * @typedef {Object} ContactListMemberDocument
 * @property {string} id
 * @property {string} contactId - FK → contacts
 * @property {string} listId - FK → contact_lists
 * @property {typeof CONTACT_LIST_MEMBER_STATUS[keyof typeof CONTACT_LIST_MEMBER_STATUS]} status
 * @property {import("firebase/firestore").Timestamp|null} subscribedAt
 * @property {import("firebase/firestore").Timestamp|null} unsubscribedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<ContactListMemberDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ContactListMemberDocument, "id">}
 */
export function createContactListMember(fields) {
  const now = Timestamp.now();
  return {
    contactId:      fields.contactId,
    listId:         fields.listId,
    status:         fields.status         ?? CONTACT_LIST_MEMBER_STATUS.SUBSCRIBED,
    subscribedAt:   fields.subscribedAt   ?? null,
    unsubscribedAt: fields.unsubscribedAt ?? null,
    createdAt:      now,
    updatedAt:      now,
  };
}

export const contactListMemberConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      contactId:      data.contactId,
      listId:         data.listId,
      status:         data.status,
      subscribedAt:   data.subscribedAt   ?? null,
      unsubscribedAt: data.unsubscribedAt ?? null,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - contact_list_members (contactId ASC, listId ASC)  — Enforce uniqueness per contact-list pair.
 *   - contact_list_members (listId ASC, status ASC)     — Filter members by list and subscription status.
 */
