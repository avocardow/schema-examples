// transcripts: speech-to-text transcription records for meetings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const TRANSCRIPT_STATUSES = /** @type {const} */ ({
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
});

/**
 * @typedef {Object} TranscriptDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string} language
 * @property {typeof TRANSCRIPT_STATUSES[keyof typeof TRANSCRIPT_STATUSES]} status
 * @property {string | null} startedBy - FK → users
 * @property {number} segmentCount
 * @property {import("firebase/firestore").Timestamp} startedAt
 * @property {import("firebase/firestore").Timestamp | null} completedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createTranscript(fields) {
  return {
    meetingId: fields.meetingId,
    language: fields.language ?? "en",
    status: fields.status ?? TRANSCRIPT_STATUSES.PROCESSING,
    startedBy: fields.startedBy ?? null,
    segmentCount: fields.segmentCount ?? 0,
    startedAt: fields.startedAt ?? Timestamp.now(),
    completedAt: fields.completedAt ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const transcriptConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      language: data.language,
      status: data.status,
      startedBy: data.startedBy ?? null,
      segmentCount: data.segmentCount,
      startedAt: data.startedAt,
      completedAt: data.completedAt ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - transcripts: meetingId ASC, createdAt DESC
 *   - transcripts: status ASC, createdAt DESC
 */
