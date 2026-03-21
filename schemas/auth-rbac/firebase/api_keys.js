// api_keys: Server-issued API keys for programmatic access. Scoped to a user or organization.
// Keys are identified by prefix and looked up by hash — the raw key is never stored.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "api_keys"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - keyHash stores only the SHA-256 hash of the raw key. The plaintext key is shown
 *     once at creation and never stored — treat it like a password.
 *   - keyPrefix (first 8 chars) allows users to identify keys without exposing the full value.
 *   - Revoked keys (revokedAt != null) must be rejected server-side during authentication.
 *   - Expired keys (expiresAt < now) must also be rejected. Run a periodic cleanup job.
 *   - scopes restrict what the key can do; null = full access (dangerous — prefer explicit scopes).
 */

/**
 * @typedef {Object} ApiKeyDocument
 * @property {string|null}    userId          - Owner user. Null if organization-level key.
 * @property {string|null}    organizationId  - Owning organization. Null if user-level key.
 * @property {string}         name            - Human-readable label, e.g., "CI/CD pipeline".
 * @property {string}         keyPrefix       - First 8 characters of the raw key for identification.
 * @property {string}         keyHash         - SHA-256 hash of the full key. Must be unique.
 * @property {string[]|null}  scopes          - Allowed scopes, e.g., ["read:users","write:posts"]. Null = unrestricted.
 * @property {Timestamp|null} lastUsedAt      - Updated on each API call. Useful for detecting stale keys.
 * @property {string|null}    lastUsedIp      - IP address of the most recent call.
 * @property {Timestamp|null} expiresAt       - Null = never expires.
 * @property {Timestamp|null} revokedAt       - Null = active. Set when the key is revoked.
 * @property {Timestamp}      createdAt
 * @property {Timestamp}      updatedAt
 */

/**
 * @param {Omit<ApiKeyDocument, "lastUsedAt" | "lastUsedIp" | "revokedAt" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<ApiKeyDocument, "id">}
 */
export function createApiKey(fields) {
  const now = Timestamp.now();
  return {
    userId:         fields.userId         ?? null,
    organizationId: fields.organizationId ?? null,
    name:           fields.name,
    keyPrefix:      fields.keyPrefix,
    keyHash:        fields.keyHash,
    scopes:         fields.scopes         ?? null,
    lastUsedAt:     null,
    lastUsedIp:     null,
    expiresAt:      fields.expiresAt      ?? null,
    revokedAt:      null,
    createdAt:      now,
    updatedAt:      now,
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("api_keys").withConverter(apiKeyConverter)
 */
export const apiKeyConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      userId:         data.userId         ?? null,
      organizationId: data.organizationId ?? null,
      name:           data.name,
      keyPrefix:      data.keyPrefix,
      keyHash:        data.keyHash,
      scopes:         data.scopes         ?? null,
      lastUsedAt:     data.lastUsedAt     ?? null, // Timestamp | null
      lastUsedIp:     data.lastUsedIp     ?? null,
      expiresAt:      data.expiresAt      ?? null, // Timestamp | null
      revokedAt:      data.revokedAt      ?? null, // Timestamp | null
      createdAt:      data.createdAt,              // Timestamp
      updatedAt:      data.updatedAt,              // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - api_keys.userId          ASC  — "List all API keys for this user."
 *   - api_keys.organizationId  ASC  — "List all API keys for this organization."
 *   - api_keys.keyHash         ASC  — Must be unique; enforce via transaction before write.
 */
