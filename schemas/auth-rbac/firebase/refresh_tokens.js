// refresh_tokens: Long-lived tokens for obtaining new access tokens without re-authentication.
// Uses a rotation chain (parentId self-reference): when a token is used it is revoked and a new
// child is issued. Reuse of a revoked token indicates theft — revoke the entire chain.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "refresh_tokens"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - tokenHash stores the SHA-256 hash of the raw token sent to the client.
 *   - On each use: set revoked=true + revokedAt on the current token, then create a new child.
 *   - If a revoked token is presented again (reuse detection), revoke ALL tokens sharing the
 *     same rotation chain by walking parentId up to the root.
 *   - Run a periodic cleanup job to delete documents where expiresAt < now AND revoked=true.
 */

/**
 * @typedef {Object} RefreshTokenDocument
 * @property {string}         sessionId   - Reference to the sessions document.
 * @property {string}         tokenHash   - SHA-256 hash of the raw token. The raw token is sent to the client.
 * @property {string|null}    parentId    - The token this one replaced. Null = first token in the rotation chain.
 * @property {boolean}        revoked     - True when this token has been rotated out or explicitly revoked.
 * @property {Timestamp|null} revokedAt   - When this token was revoked (rotation or explicit logout).
 * @property {Timestamp}      expiresAt   - Typically 7–30 days. Longer than access tokens, shorter than sessions.
 * @property {Timestamp}      createdAt
 */

/**
 * @param {Omit<RefreshTokenDocument, "revoked" | "revokedAt" | "createdAt">} fields
 * @returns {Omit<RefreshTokenDocument, "id">}
 */
export function createRefreshToken(fields) {
  return {
    sessionId: fields.sessionId,
    tokenHash: fields.tokenHash,
    parentId:  fields.parentId ?? null,
    revoked:   false,
    revokedAt: null,
    expiresAt: fields.expiresAt,
    createdAt: Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("refresh_tokens").withConverter(refreshTokenConverter)
 */
export const refreshTokenConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:        snapshot.id,
      sessionId: data.sessionId,
      tokenHash: data.tokenHash,
      parentId:  data.parentId  ?? null,
      revoked:   data.revoked   ?? false,
      revokedAt: data.revokedAt ?? null,  // Timestamp | null
      expiresAt: data.expiresAt,          // Timestamp
      createdAt: data.createdAt,          // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - refresh_tokens.tokenHash  ASC  — Must be unique; enforce via transaction before write.
 *   - refresh_tokens.sessionId  ASC  — "Revoke all refresh tokens for this session" (logout).
 *   - refresh_tokens.parentId   ASC  — Walk the rotation chain for reuse detection.
 */
