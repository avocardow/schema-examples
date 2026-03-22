// report_notes: Internal moderator notes on queue items.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "report_notes"
 * Document ID: Firestore auto-generated
 *
 * Internal moderator notes on reports. Moderators add notes to document
 * their reasoning, share context with other moderators, or record interim
 * decisions before final resolution. Append-only — notes are never edited.
 */

/**
 * @typedef {Object} ReportNoteDocument
 * @property {string}    id            - Document ID (from snapshot.id).
 * @property {string}    queueItemId   - FK → moderation_queue_items
 * @property {string}    moderatorId   - FK → users
 * @property {string}    content       - The note text. Internal-only, never shown to the reported user.
 * @property {import("firebase/firestore").Timestamp} createdAt
 */

/**
 * @param {Omit<ReportNoteDocument, "id" | "createdAt">} fields
 * @returns {Omit<ReportNoteDocument, "id">}
 */
export function createReportNote(fields) {
  return {
    queueItemId: fields.queueItemId,
    moderatorId: fields.moderatorId,
    content:     fields.content,
    createdAt:   Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("report_notes").withConverter(reportNoteConverter)
 */
export const reportNoteConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:          snapshot.id,
      queueItemId: data.queueItemId,
      moderatorId: data.moderatorId,
      content:     data.content,
      createdAt:   data.createdAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - report_notes.queueItemId ASC — "All notes for this queue item."
 *   - report_notes.moderatorId ASC — "All notes by this moderator."
 */
