// password_history: Previous password hashes for enterprise "cannot reuse last N passwords" policies.
// Optional — only needed for regulated industries (finance, healthcare, government).
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "password_history"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - Store only hashed passwords (bcrypt, argon2id, scrypt). Never plaintext.
 *   - This collection stores *previous* hashes only. The current hash lives in accounts.
 *   - Restrict reads to server-side only — clients have no legitimate reason to read this.
 *   - Keep only the last N hashes per user (e.g., 5–10); delete older entries on write.
 */

/**
 * @typedef {Object} PasswordHistoryDocument
 * @property {string}    userId        - Reference to the user. Index this field.
 * @property {string}    passwordHash  - The previous password hash. Compared against new passwords to prevent reuse.
 * @property {Timestamp} createdAt     - When this password was set (not when it was retired).
 */

/**
 * @param {{ userId: string; passwordHash: string }} fields
 * @returns {Omit<PasswordHistoryDocument, "id">}
 */
export function createPasswordHistory(fields) {
  return {
    userId:       fields.userId,
    passwordHash: fields.passwordHash,
    createdAt:    Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("password_history").withConverter(passwordHistoryConverter)
 */
export const passwordHistoryConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      userId:       data.userId,
      passwordHash: data.passwordHash,
      createdAt:    data.createdAt, // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Composite:
 *   - password_history.userId     ASC
 *     password_history.createdAt  DESC
 *     — "Get last N passwords for this user" ordered by recency.
 */
