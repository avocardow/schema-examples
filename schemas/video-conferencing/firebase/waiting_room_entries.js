// waiting_room_entries: users waiting to be admitted into a meeting.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const WAITING_ROOM_STATUSES = /** @type {const} */ ({
  WAITING: "waiting",
  ADMITTED: "admitted",
  REJECTED: "rejected",
});

/**
 * @typedef {Object} WaitingRoomEntryDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string | null} userId - FK → users
 * @property {string} displayName
 * @property {typeof WAITING_ROOM_STATUSES[keyof typeof WAITING_ROOM_STATUSES]} status
 * @property {string | null} admittedBy - FK → users
 * @property {import("firebase/firestore").Timestamp | null} respondedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createWaitingRoomEntry(fields) {
  return {
    meetingId: fields.meetingId,
    userId: fields.userId ?? null,
    displayName: fields.displayName,
    status: fields.status ?? WAITING_ROOM_STATUSES.WAITING,
    admittedBy: fields.admittedBy ?? null,
    respondedAt: fields.respondedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const waitingRoomEntryConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      userId: data.userId ?? null,
      displayName: data.displayName,
      status: data.status,
      admittedBy: data.admittedBy ?? null,
      respondedAt: data.respondedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - waiting_room_entries: meetingId ASC, status ASC, createdAt ASC
 *   - waiting_room_entries: userId ASC, createdAt DESC
 */
