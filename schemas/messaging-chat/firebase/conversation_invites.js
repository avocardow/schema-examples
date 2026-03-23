// conversation_invites: invitations sent to users to join a conversation.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const INVITE_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  EXPIRED: "expired",
});

/**
 * @typedef {Object} ConversationInviteDocument
 * @property {string} id
 * @property {string} conversationId - FK → conversations
 * @property {string} inviterId - FK → users
 * @property {string} inviteeId - FK → users
 * @property {typeof INVITE_STATUSES[keyof typeof INVITE_STATUSES]} status
 * @property {string | null} message
 * @property {import("firebase/firestore").Timestamp | null} expiresAt
 * @property {import("firebase/firestore").Timestamp | null} respondedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createConversationInvite(fields) {
  return {
    conversationId: fields.conversationId,
    inviterId: fields.inviterId,
    inviteeId: fields.inviteeId,
    status: fields.status ?? "pending",
    message: fields.message ?? null,
    expiresAt: fields.expiresAt ?? null,
    respondedAt: fields.respondedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const conversationInviteConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      conversationId: data.conversationId,
      inviterId: data.inviterId,
      inviteeId: data.inviteeId,
      status: data.status,
      message: data.message ?? null,
      expiresAt: data.expiresAt ?? null,
      respondedAt: data.respondedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field indexes (auto-created by Firestore):
 *   - expiresAt ASC
 *
 * Composite indexes:
 *   - inviteeId ASC, status ASC
 *   - conversationId ASC, status ASC
 */
