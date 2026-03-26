// dispute_messages: Threaded communication within dispute cases.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const DISPUTE_SENDER_ROLE = /** @type {const} */ ({
  CUSTOMER: "customer",
  VENDOR: "vendor",
  ADMIN: "admin",
});

/**
 * @typedef {Object} DisputeMessageDocument
 * @property {string} id
 * @property {string} disputeId - FK → disputes
 * @property {string} senderId - FK → users
 * @property {typeof DISPUTE_SENDER_ROLE[keyof typeof DISPUTE_SENDER_ROLE]} senderRole
 * @property {string} body
 * @property {Array|null} attachments
 * @property {Timestamp} createdAt
 */

/**
 * @param {Omit<DisputeMessageDocument, "id" | "createdAt">} data
 * @returns {Omit<DisputeMessageDocument, "id">}
 */
export function createDisputeMessage(data) {
  return {
    disputeId: data.disputeId,
    senderId: data.senderId,
    senderRole: data.senderRole,
    body: data.body,
    attachments: data.attachments ?? null,
    createdAt: Timestamp.now(),
  };
}

export const disputeMessageConverter = {
  toFirestore(message) {
    const { id, ...data } = message;
    return data;
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      disputeId: data.disputeId,
      senderId: data.senderId,
      senderRole: data.senderRole,
      body: data.body,
      attachments: data.attachments ?? null,
      createdAt: data.createdAt,
    };
  },
};

// Suggested indexes:
// - disputeId ASC, createdAt ASC
