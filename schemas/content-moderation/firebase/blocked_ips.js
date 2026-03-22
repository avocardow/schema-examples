// blocked_ips: IP-level access blocking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "blocked_ips"
 * Document ID: Firestore auto-generated or UUID
 *
 * IP-level blocking for preventing access from specific IP addresses or CIDR
 * ranges (e.g., "192.168.1.100", "10.0.0.0/8"). Blocks can be temporary (with
 * expiresAt) or permanent (expiresAt = null). Inspired by Mastodon's ip_blocks
 * with severity levels and expiry support.
 */

export const BLOCKED_IP_SEVERITY = /** @type {const} */ ({
  SIGN_UP_BLOCK: "sign_up_block",
  LOGIN_BLOCK: "login_block",
  FULL_BLOCK: "full_block",
});

/**
 * @typedef {Object} BlockedIpDocument
 * @property {string}      id         - Document ID (from snapshot.id).
 * @property {string}      ipAddress  - IP address or CIDR range. Unique per document.
 * @property {typeof BLOCKED_IP_SEVERITY[keyof typeof BLOCKED_IP_SEVERITY]} severity - Block level.
 * @property {string|null} reason     - Why this IP was blocked.
 * @property {import("firebase/firestore").Timestamp|null} expiresAt - When the block expires. Null = permanent.
 * @property {string}      createdBy  - FK → users. Who blocked this IP.
 * @property {import("firebase/firestore").Timestamp} createdAt
 * @property {import("firebase/firestore").Timestamp} updatedAt
 */

/**
 * @param {Omit<BlockedIpDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<BlockedIpDocument, "id">}
 */
export function createBlockedIp(fields) {
  return {
    ipAddress:  fields.ipAddress,
    severity:   fields.severity  ?? BLOCKED_IP_SEVERITY.FULL_BLOCK,
    reason:     fields.reason    ?? null,
    expiresAt:  fields.expiresAt ?? null,
    createdBy:  fields.createdBy,
    createdAt:  Timestamp.now(),
    updatedAt:  Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("blocked_ips").withConverter(blockedIpConverter)
 */
export const blockedIpConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:         snapshot.id,
      ipAddress:  data.ipAddress,
      severity:   data.severity,
      reason:     data.reason    ?? null,
      expiresAt:  data.expiresAt ?? null,
      createdBy:  data.createdBy,
      createdAt:  data.createdAt,
      updatedAt:  data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - blocked_ips.severity   ASC  — "All full blocks."
 *   - blocked_ips.expiresAt  ASC  — Cleanup job: find and remove expired blocks.
 *   - blocked_ips.createdBy  ASC  — "All IPs blocked by this moderator."
 */
