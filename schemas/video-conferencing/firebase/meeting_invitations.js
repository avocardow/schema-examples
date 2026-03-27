// meeting_invitations: invitations sent to users for upcoming meetings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const INVITATION_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  ACCEPTED: "accepted",
  DECLINED: "declined",
  TENTATIVE: "tentative",
});

/**
 * @typedef {Object} MeetingInvitationDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string} inviterId - FK → users
 * @property {string} inviteeId - FK → users
 * @property {typeof INVITATION_STATUSES[keyof typeof INVITATION_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} respondedAt
 * @property {string | null} message
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createMeetingInvitation(fields) {
  return {
    meetingId: fields.meetingId,
    inviterId: fields.inviterId,
    inviteeId: fields.inviteeId,
    status: fields.status ?? INVITATION_STATUSES.PENDING,
    respondedAt: fields.respondedAt ?? null,
    message: fields.message ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const meetingInvitationConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      inviterId: data.inviterId,
      inviteeId: data.inviteeId,
      status: data.status,
      respondedAt: data.respondedAt ?? null,
      message: data.message ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - meeting_invitations: meetingId ASC, status ASC
 *   - meeting_invitations: inviteeId ASC, status ASC, createdAt DESC
 *   - meeting_invitations: inviterId ASC, createdAt DESC
 */
