// ticket_transfers: Audit log of ticket ownership transfers between attendees.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TicketTransferDocument
 * @property {string} id
 * @property {string} ticketId - FK → tickets
 * @property {string | null} fromUserId - FK → users
 * @property {string} fromName
 * @property {string} fromEmail
 * @property {string | null} toUserId - FK → users
 * @property {string} toName
 * @property {string} toEmail
 * @property {import("firebase/firestore").Timestamp} transferredAt
 * @property {string | null} notes
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TicketTransferDocument, "id" | "transferredAt" | "createdAt">} fields
 * @returns {Omit<TicketTransferDocument, "id">}
 */
export function createTicketTransfer(fields) {
  return {
    ticketId: fields.ticketId,
    fromUserId: fields.fromUserId ?? null,
    fromName: fields.fromName,
    fromEmail: fields.fromEmail,
    toUserId: fields.toUserId ?? null,
    toName: fields.toName,
    toEmail: fields.toEmail,
    transferredAt: Timestamp.now(),
    notes: fields.notes ?? null,
    createdAt: Timestamp.now(),
  };
}

export const ticketTransferConverter = {
  /** @param {Omit<TicketTransferDocument, "id">} doc */
  toFirestore(doc) {
    return { ...doc };
  },
  /** @param {import("firebase/firestore").QueryDocumentSnapshot} snapshot */
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ticketId: data.ticketId,
      fromUserId: data.fromUserId ?? null,
      fromName: data.fromName,
      fromEmail: data.fromEmail,
      toUserId: data.toUserId ?? null,
      toName: data.toName,
      toEmail: data.toEmail,
      transferredAt: data.transferredAt,
      notes: data.notes ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_transfers"
 *   - ticketId (ASC), transferredAt (DESC)
 *   - fromUserId (ASC), transferredAt (DESC)
 *   - toUserId (ASC), transferredAt (DESC)
 */
