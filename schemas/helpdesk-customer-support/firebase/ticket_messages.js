// ticket_messages: threaded replies and internal notes attached to a ticket.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TICKET_MESSAGE_TYPES = /** @type {const} */ ({
  REPLY: "reply",
  NOTE: "note",
  CUSTOMER_MESSAGE: "customer_message",
  SYSTEM: "system",
});

export const TICKET_MESSAGE_CHANNELS = /** @type {const} */ ({
  EMAIL: "email",
  WEB: "web",
  API: "api",
  SYSTEM: "system",
});

/**
 * @typedef {Object} TicketMessageDocument
 * @property {string} id
 * @property {string} ticketId - FK → tickets
 * @property {string | null} senderId - FK → users
 * @property {typeof TICKET_MESSAGE_TYPES[keyof typeof TICKET_MESSAGE_TYPES]} type
 * @property {string} body
 * @property {boolean} isPrivate
 * @property {typeof TICKET_MESSAGE_CHANNELS[keyof typeof TICKET_MESSAGE_CHANNELS]} channel
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TicketMessageDocument, "id" | "createdAt">} fields
 * @returns {Omit<TicketMessageDocument, "id">}
 */
export function createTicketMessage(fields) {
  return {
    ticketId: fields.ticketId,
    senderId: fields.senderId ?? null,
    type: fields.type,
    body: fields.body,
    isPrivate: fields.isPrivate ?? false,
    channel: fields.channel ?? TICKET_MESSAGE_CHANNELS.WEB,
    createdAt: Timestamp.now(),
  };
}

export const ticketMessageConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ticketId: data.ticketId,
      senderId: data.senderId ?? null,
      type: data.type,
      body: data.body,
      isPrivate: data.isPrivate,
      channel: data.channel,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_messages"
 *   - ticketId ASC, createdAt ASC
 *   - senderId ASC
 */
