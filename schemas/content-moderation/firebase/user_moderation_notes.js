// user_moderation_notes: Internal moderator notes on user accounts.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "user_moderation_notes"
 * Document ID: Firestore auto-generated
 *
 * Internal moderator notes on user accounts. Moderators add notes to document
 * their observations, share context with other moderators, or record concerns
 * about a user's behavior over time.
 */

/**
 * @typedef {Object} UserModerationNoteDocument
 * @property {string}    id        - Document ID (from snapshot.id).
 * @property {string}    userId    - FK → users. The user this note is about.
 * @property {string}    authorId  - FK → users. The moderator who wrote this note.
 * @property {string}    body      - The note text. Internal-only, never shown to the user.
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<UserModerationNoteDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<UserModerationNoteDocument, "id">}
 */
export function createUserModerationNote(fields) {
  return {
    userId:    fields.userId,
    authorId:  fields.authorId,
    body:      fields.body,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("user_moderation_notes").withConverter(userModerationNoteConverter)
 */
export const userModerationNoteConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      userId:    data.userId,
      authorId:  data.authorId,
      body:      data.body,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - user_moderation_notes.userId   ASC — "All notes for this user."
 *   - user_moderation_notes.authorId ASC — "All notes by this moderator."
 */
