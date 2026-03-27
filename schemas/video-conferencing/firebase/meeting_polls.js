// meeting_polls: polls created by hosts during a meeting for audience feedback.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const POLL_TYPES = /** @type {const} */ ({
  SINGLE_CHOICE: "single_choice",
  MULTIPLE_CHOICE: "multiple_choice",
});

export const POLL_STATUSES = /** @type {const} */ ({
  DRAFT: "draft",
  ACTIVE: "active",
  CLOSED: "closed",
});

/**
 * @typedef {Object} MeetingPollDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string} createdBy - FK → users
 * @property {string} question
 * @property {Array} options
 * @property {typeof POLL_TYPES[keyof typeof POLL_TYPES]} pollType
 * @property {typeof POLL_STATUSES[keyof typeof POLL_STATUSES]} status
 * @property {import("firebase/firestore").Timestamp | null} launchedAt
 * @property {import("firebase/firestore").Timestamp | null} closedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createMeetingPoll(fields) {
  return {
    meetingId: fields.meetingId,
    createdBy: fields.createdBy,
    question: fields.question,
    options: fields.options,
    pollType: fields.pollType ?? POLL_TYPES.SINGLE_CHOICE,
    status: fields.status ?? POLL_STATUSES.DRAFT,
    launchedAt: fields.launchedAt ?? null,
    closedAt: fields.closedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const meetingPollConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      createdBy: data.createdBy,
      question: data.question,
      options: data.options,
      pollType: data.pollType,
      status: data.status,
      launchedAt: data.launchedAt ?? null,
      closedAt: data.closedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - meeting_polls: meetingId ASC, createdAt ASC
 *   - meeting_polls: meetingId ASC, status ASC
 */
