// meeting_participants: users who have joined or are currently in a meeting.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const PARTICIPANT_ROLES = /** @type {const} */ ({
  HOST: "host",
  CO_HOST: "co_host",
  MODERATOR: "moderator",
  ATTENDEE: "attendee",
  VIEWER: "viewer",
});

/**
 * @typedef {Object} MeetingParticipantDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string | null} userId - FK → users
 * @property {string} displayName
 * @property {typeof PARTICIPANT_ROLES[keyof typeof PARTICIPANT_ROLES]} role
 * @property {import("firebase/firestore").Timestamp} joinedAt
 * @property {import("firebase/firestore").Timestamp | null} leftAt
 * @property {number | null} durationSeconds
 * @property {boolean} isCameraOn
 * @property {boolean} isMicOn
 * @property {boolean} isScreenSharing
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createMeetingParticipant(fields) {
  return {
    meetingId: fields.meetingId,
    userId: fields.userId ?? null,
    displayName: fields.displayName,
    role: fields.role ?? PARTICIPANT_ROLES.ATTENDEE,
    joinedAt: fields.joinedAt ?? Timestamp.now(),
    leftAt: fields.leftAt ?? null,
    durationSeconds: fields.durationSeconds ?? null,
    isCameraOn: fields.isCameraOn ?? false,
    isMicOn: fields.isMicOn ?? false,
    isScreenSharing: fields.isScreenSharing ?? false,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const meetingParticipantConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      userId: data.userId ?? null,
      displayName: data.displayName,
      role: data.role,
      joinedAt: data.joinedAt,
      leftAt: data.leftAt ?? null,
      durationSeconds: data.durationSeconds ?? null,
      isCameraOn: data.isCameraOn,
      isMicOn: data.isMicOn,
      isScreenSharing: data.isScreenSharing,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - meeting_participants: meetingId ASC, joinedAt ASC
 *   - meeting_participants: userId ASC, joinedAt DESC
 *   - meeting_participants: meetingId ASC, role ASC
 */
