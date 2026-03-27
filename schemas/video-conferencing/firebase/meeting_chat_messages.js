// meeting_chat_messages: text messages sent during a live meeting.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MeetingChatMessageDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string | null} senderId - FK → users
 * @property {string | null} recipientId - FK → users
 * @property {string} content
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createMeetingChatMessage(fields) {
  return {
    meetingId: fields.meetingId,
    senderId: fields.senderId ?? null,
    recipientId: fields.recipientId ?? null,
    content: fields.content,
    createdAt: Timestamp.now(),
  };
}

export const meetingChatMessageConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      senderId: data.senderId ?? null,
      recipientId: data.recipientId ?? null,
      content: data.content,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - meeting_chat_messages: meetingId ASC, createdAt ASC
 *   - meeting_chat_messages: senderId ASC, createdAt DESC
 */
