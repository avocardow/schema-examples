// meetings: scheduled or ad-hoc video-conferencing sessions within a room.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const MEETING_STATUSES = /** @type {const} */ ({
  SCHEDULED: "scheduled",
  LIVE: "live",
  ENDED: "ended",
  CANCELLED: "cancelled",
});

/**
 * @typedef {Object} MeetingDocument
 * @property {string} id
 * @property {string} roomId - FK → rooms
 * @property {string | null} title
 * @property {typeof MEETING_STATUSES[keyof typeof MEETING_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} scheduledStart
 * @property {import("firebase/firestore").Timestamp | null} scheduledEnd
 * @property {import("firebase/firestore").Timestamp | null} actualStart
 * @property {import("firebase/firestore").Timestamp | null} actualEnd
 * @property {number | null} maxParticipants
 * @property {boolean | null} enableWaitingRoom
 * @property {string} hostId - FK → users
 * @property {number} participantCount
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createMeeting(fields) {
  return {
    roomId: fields.roomId,
    title: fields.title ?? null,
    status: fields.status ?? MEETING_STATUSES.SCHEDULED,
    scheduledStart: fields.scheduledStart ?? null,
    scheduledEnd: fields.scheduledEnd ?? null,
    actualStart: fields.actualStart ?? null,
    actualEnd: fields.actualEnd ?? null,
    maxParticipants: fields.maxParticipants ?? null,
    enableWaitingRoom: fields.enableWaitingRoom ?? null,
    hostId: fields.hostId,
    participantCount: fields.participantCount ?? 0,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const meetingConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      roomId: data.roomId,
      title: data.title ?? null,
      status: data.status,
      scheduledStart: data.scheduledStart ?? null,
      scheduledEnd: data.scheduledEnd ?? null,
      actualStart: data.actualStart ?? null,
      actualEnd: data.actualEnd ?? null,
      maxParticipants: data.maxParticipants ?? null,
      enableWaitingRoom: data.enableWaitingRoom ?? null,
      hostId: data.hostId,
      participantCount: data.participantCount,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - meetings: roomId ASC, scheduledStart DESC
 *   - meetings: hostId ASC, status ASC, scheduledStart DESC
 *   - meetings: status ASC, scheduledStart ASC
 */
