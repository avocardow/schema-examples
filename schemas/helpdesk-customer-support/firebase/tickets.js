// tickets: core support requests submitted by users and managed by agents.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TICKET_TYPES = /** @type {const} */ ({
  QUESTION: "question",
  INCIDENT: "incident",
  PROBLEM: "problem",
  FEATURE_REQUEST: "feature_request",
});

export const TICKET_SOURCES = /** @type {const} */ ({
  EMAIL: "email",
  WEB: "web",
  PHONE: "phone",
  API: "api",
  SOCIAL: "social",
});

/**
 * @typedef {Object} TicketDocument
 * @property {string} id
 * @property {string} subject
 * @property {string | null} description
 * @property {string} statusId - FK → ticket_statuses
 * @property {string} priorityId - FK → ticket_priorities
 * @property {typeof TICKET_TYPES[keyof typeof TICKET_TYPES]} type
 * @property {typeof TICKET_SOURCES[keyof typeof TICKET_SOURCES]} source
 * @property {string | null} categoryId - FK → ticket_categories
 * @property {string} requesterId - FK → users
 * @property {string | null} assignedAgentId - FK → users
 * @property {string | null} assignedTeamId - references auth-rbac teams externally
 * @property {string | null} slaPolicyId - FK → sla_policies
 * @property {import("firebase/firestore").Timestamp | null} dueAt
 * @property {import("firebase/firestore").Timestamp | null} firstResponseAt
 * @property {import("firebase/firestore").Timestamp | null} resolvedAt
 * @property {import("firebase/firestore").Timestamp | null} closedAt
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<TicketDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<TicketDocument, "id">}
 */
export function createTicket(fields) {
  return {
    subject: fields.subject,
    description: fields.description ?? null,
    statusId: fields.statusId,
    priorityId: fields.priorityId,
    type: fields.type ?? TICKET_TYPES.QUESTION,
    source: fields.source ?? TICKET_SOURCES.WEB,
    categoryId: fields.categoryId ?? null,
    requesterId: fields.requesterId,
    assignedAgentId: fields.assignedAgentId ?? null,
    assignedTeamId: fields.assignedTeamId ?? null,
    slaPolicyId: fields.slaPolicyId ?? null,
    dueAt: fields.dueAt ?? null,
    firstResponseAt: fields.firstResponseAt ?? null,
    resolvedAt: fields.resolvedAt ?? null,
    closedAt: fields.closedAt ?? null,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const ticketConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      subject: data.subject,
      description: data.description ?? null,
      statusId: data.statusId,
      priorityId: data.priorityId,
      type: data.type,
      source: data.source,
      categoryId: data.categoryId ?? null,
      requesterId: data.requesterId,
      assignedAgentId: data.assignedAgentId ?? null,
      assignedTeamId: data.assignedTeamId ?? null,
      slaPolicyId: data.slaPolicyId ?? null,
      dueAt: data.dueAt ?? null,
      firstResponseAt: data.firstResponseAt ?? null,
      resolvedAt: data.resolvedAt ?? null,
      closedAt: data.closedAt ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes:
 *   collection: "tickets"
 *   - statusId ASC, createdAt DESC
 *   - priorityId ASC, createdAt DESC
 *   - requesterId ASC, createdAt DESC
 *   - assignedAgentId ASC, createdAt DESC
 *   - assignedTeamId ASC, createdAt DESC
 *   - categoryId ASC, createdAt DESC
 *   - slaPolicyId ASC
 *   - dueAt ASC
 */
