// transcript_segments: individual spoken segments within a transcript.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} TranscriptSegmentDocument
 * @property {string} id
 * @property {string} transcriptId - FK → transcripts
 * @property {string | null} speakerId - FK → users
 * @property {string} content
 * @property {string | null} speakerName
 * @property {number} startMs
 * @property {number} endMs
 * @property {number} position
 * @property {number | null} confidence
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createTranscriptSegment(fields) {
  return {
    transcriptId: fields.transcriptId,
    speakerId: fields.speakerId ?? null,
    content: fields.content,
    speakerName: fields.speakerName ?? null,
    startMs: fields.startMs,
    endMs: fields.endMs,
    position: fields.position,
    confidence: fields.confidence ?? null,
    createdAt: Timestamp.now(),
  };
}

export const transcriptSegmentConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      transcriptId: data.transcriptId,
      speakerId: data.speakerId ?? null,
      content: data.content,
      speakerName: data.speakerName ?? null,
      startMs: data.startMs,
      endMs: data.endMs,
      position: data.position,
      confidence: data.confidence ?? null,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - transcript_segments: transcriptId ASC, position ASC
 *   - transcript_segments: transcriptId ASC, startMs ASC
 *   - transcript_segments: speakerId ASC, createdAt DESC
 */
