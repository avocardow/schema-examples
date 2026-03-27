// meeting_reactions: emoji reactions sent by participants during a meeting.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} MeetingReactionDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string} userId - FK → users
 * @property {string} emoji
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createMeetingReaction(fields) {
  return {
    meetingId: fields.meetingId,
    userId: fields.userId,
    emoji: fields.emoji,
    createdAt: Timestamp.now(),
  };
}

export const meetingReactionConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      userId: data.userId,
      emoji: data.emoji,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - meeting_reactions: meetingId ASC, createdAt ASC
 *   - meeting_reactions: userId ASC, createdAt DESC
 */
