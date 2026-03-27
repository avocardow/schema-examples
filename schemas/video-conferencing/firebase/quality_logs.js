// quality_logs: network and media quality metrics sampled during a meeting.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * @typedef {Object} QualityLogDocument
 * @property {string} id
 * @property {string} meetingId - FK → meetings
 * @property {string} participantId - FK → meeting_participants
 * @property {number | null} bitrateKbps
 * @property {number | null} packetLossPct
 * @property {number | null} jitterMs
 * @property {number | null} roundTripMs
 * @property {number | null} videoWidth
 * @property {number | null} videoHeight
 * @property {number | null} framerate
 * @property {number | null} qualityScore
 * @property {import("firebase/firestore").Timestamp} loggedAt
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

export function createQualityLog(fields) {
  return {
    meetingId: fields.meetingId,
    participantId: fields.participantId,
    bitrateKbps: fields.bitrateKbps ?? null,
    packetLossPct: fields.packetLossPct ?? null,
    jitterMs: fields.jitterMs ?? null,
    roundTripMs: fields.roundTripMs ?? null,
    videoWidth: fields.videoWidth ?? null,
    videoHeight: fields.videoHeight ?? null,
    framerate: fields.framerate ?? null,
    qualityScore: fields.qualityScore ?? null,
    loggedAt: fields.loggedAt ?? Timestamp.now(),
    createdAt: Timestamp.now(),
  };
}

export const qualityLogConverter = {
  toFirestore(doc) { return { ...doc }; },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id: snapshot.id,
      meetingId: data.meetingId,
      participantId: data.participantId,
      bitrateKbps: data.bitrateKbps ?? null,
      packetLossPct: data.packetLossPct ?? null,
      jitterMs: data.jitterMs ?? null,
      roundTripMs: data.roundTripMs ?? null,
      videoWidth: data.videoWidth ?? null,
      videoHeight: data.videoHeight ?? null,
      framerate: data.framerate ?? null,
      qualityScore: data.qualityScore ?? null,
      loggedAt: data.loggedAt,
      createdAt: data.createdAt,
    };
  },
};

/*
 * Suggested Firestore indexes (firestore.indexes.json):
 *   - quality_logs: meetingId ASC, loggedAt ASC
 *   - quality_logs: participantId ASC, loggedAt ASC
 *   - quality_logs: meetingId ASC, participantId ASC, loggedAt ASC
 */
