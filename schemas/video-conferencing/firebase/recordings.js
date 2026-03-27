// recordings: captured audio/video files from meetings.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

export const RECORDING_TYPES = /** @type {const} */ ({
  COMPOSITE: "composite",
  AUDIO_ONLY: "audio_only",
  VIDEO_ONLY: "video_only",
  SCREEN_SHARE: "screen_share",
});

export const RECORDING_STATUSES = /** @type {const} */ ({
  RECORDING: "recording",
  PROCESSING: "processing",
  READY: "ready",
  FAILED: "failed",
  DELETED: "deleted",
});

/**
 * @typedef {Object} RecordingDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string | null} fileId - FK → files
 * @property {typeof RECORDING_TYPES[keyof typeof RECORDING_TYPES]} type
 * @property {typeof RECORDING_STATUSES[keyof typeof RECORDING_STATUSES]} status
 * @property {number | null} durationSeconds
 * @property {number | null} fileSize
 * @property {import("firebase/firestore").Timestamp} startedAt
 * @property {import("firebase/firestore").Timestamp | null} endedAt
 * @property {string | null} startedBy - FK → users
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

export function createRecording(fields) {
  return {
    meetingId: fields.meetingId,
    fileId: fields.fileId ?? null,
    type: fields.type ?? RECORDING_TYPES.COMPOSITE,
    status: fields.status ?? RECORDING_STATUSES.RECORDING,
    durationSeconds: fields.durationSeconds ?? null,
    fileSize: fields.fileSize ?? null,
    startedAt: fields.startedAt ?? Timestamp.now(),
    endedAt: fields.endedAt ?? null,
    startedBy: fields.startedBy ?? null,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

export const recordingConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      fileId: data.fileId ?? null,
      type: data.type,
      status: data.status,
      durationSeconds: data.durationSeconds ?? null,
      fileSize: data.fileSize ?? null,
      startedAt: data.startedAt,
      endedAt: data.endedAt ?? null,
      startedBy: data.startedBy ?? null,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - recordings: meetingId ASC, startedAt DESC
 *   - recordings: status ASC, createdAt DESC
 *   - recordings: startedBy ASC, createdAt DESC
 */
