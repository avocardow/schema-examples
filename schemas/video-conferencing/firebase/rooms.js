// rooms: virtual rooms that host video-conferencing meetings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const ROOM_TYPES = /** @type {const} */ ({
  PERMANENT: "permanent",
  TEMPORARY: "temporary",
});

/**
 * @typedef {Object} RoomDocument
 * @property {string} id
 * @property {typeof ROOM_TYPES[keyof typeof ROOM_TYPES]} type
 * @property {string} name
 * @property {string} slug
 * @property {string | null} description
 * @property {number | null} maxParticipants
 * @property {boolean} enableWaitingRoom
 * @property {boolean} enableRecording
 * @property {boolean} enableChat
 * @property {boolean} enableTranscription
 * @property {boolean} enableBreakoutRooms
 * @property {boolean} isPrivate
 * @property {string | null} passwordHash
 * @property {string} createdBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createRoom(fields) {
  return {
    type: fields.type,
    name: fields.name,
    slug: fields.slug,
    description: fields.description ?? null,
    maxParticipants: fields.maxParticipants ?? null,
    enableWaitingRoom: fields.enableWaitingRoom ?? false,
    enableRecording: fields.enableRecording ?? false,
    enableChat: fields.enableChat ?? true,
    enableTranscription: fields.enableTranscription ?? false,
    enableBreakoutRooms: fields.enableBreakoutRooms ?? false,
    isPrivate: fields.isPrivate ?? false,
    passwordHash: fields.passwordHash ?? null,
    createdBy: fields.createdBy,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const roomConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      type: data.type,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      maxParticipants: data.maxParticipants ?? null,
      enableWaitingRoom: data.enableWaitingRoom,
      enableRecording: data.enableRecording,
      enableChat: data.enableChat,
      enableTranscription: data.enableTranscription,
      enableBreakoutRooms: data.enableBreakoutRooms,
      isPrivate: data.isPrivate,
      passwordHash: data.passwordHash ?? null,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - rooms: type ASC, createdAt DESC
 *   - rooms: createdBy ASC, createdAt DESC
 *   - rooms: isPrivate ASC, type ASC, createdAt DESC
 */
