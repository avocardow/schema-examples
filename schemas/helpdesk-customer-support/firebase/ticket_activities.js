// ticket_activities: append-only audit trail of ticket changes for accountability and SLA debugging.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TICKET_ACTIVITY_ACTIONS = /** @type {const} */ ({
  CREATED: "created",
  UPDATED: "updated",
  STATUS_CHANGED: "status_changed",
  PRIORITY_CHANGED: "priority_changed",
  ASSIGNED: "assigned",
  ESCALATED: "escalated",
  REOPENED: "reopened",
  RESOLVED: "resolved",
  CLOSED: "closed",
  SLA_BREACHED: "sla_breached",
});

/**
 * @typedef {Object} TicketActivityDocument
 * @property {string} id
 * @property {string} ticketId - FK → tickets
 * @property {string | null} userId - FK → users
 * @property {typeof TICKET_ACTIVITY_ACTIONS[keyof typeof TICKET_ACTIVITY_ACTIONS]} action
 * @property {string | null} field
 * @property {string | null} oldValue
 * @property {string | null} newValue
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<TicketActivityDocument, "id" | "createdAt">} fields
 * @returns {Omit<TicketActivityDocument, "id">}
 */
export function createTicketActivity(fields) {
  return {
    ticketId: fields.ticketId,
    userId: fields.userId ?? null,
    action: fields.action,
    field: fields.field ?? null,
    oldValue: fields.oldValue ?? null,
    newValue: fields.newValue ?? null,
    createdAt: Timestamp.now(),
  };
}

export const ticketActivityConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      ticketId: data.ticketId,
      userId: data.userId ?? null,
      action: data.action,
      field: data.field ?? null,
      oldValue: data.oldValue ?? null,
      newValue: data.newValue ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "ticket_activities"
 *   - ticketId ASC, createdAt ASC
 *   - userId ASC
 */
