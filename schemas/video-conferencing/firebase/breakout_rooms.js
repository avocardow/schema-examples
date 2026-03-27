// breakout_rooms: smaller sub-rooms within a meeting for group discussions.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const BREAKOUT_ROOM_STATUSES = /** @type {const} */ ({
  PENDING: "pending",
  OPEN: "open",
  CLOSED: "closed",
});

/**
 * @typedef {Object} BreakoutRoomDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string} name
 * @property {number} position
 * @property {typeof BREAKOUT_ROOM_STATUSES[keyof typeof BREAKOUT_ROOM_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} openedAt
 * @property {import("firebase/firestore").Timestamp | null} closedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createBreakoutRoom(fields) {
  return {
    meetingId: fields.meetingId,
    name: fields.name,
    position: fields.position ?? 0,
    status: fields.status ?? BREAKOUT_ROOM_STATUSES.PENDING,
    openedAt: fields.openedAt ?? null,
    closedAt: fields.closedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const breakoutRoomConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      name: data.name,
      position: data.position,
      status: data.status,
      openedAt: data.openedAt ?? null,
      closedAt: data.closedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - breakout_rooms: meetingId ASC, position ASC
 *   - breakout_rooms: meetingId ASC, status ASC
 */
