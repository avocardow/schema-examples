// blocked_domains: Domain-level content blocking.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "blocked_domains"
 * Document ID: Firestore auto-generated or UUID
 *
 * Domain-level blocking for preventing content from specific domains. Supports
 * full domain blocks (all content rejected), media-only blocks (text allowed,
 * media rejected), and report-reject blocks (reports from that domain's users
 * are ignored). Inspired by Mastodon's domain_blocks with severity levels and
 * public/private comments.
 */

export const BLOCKED_DOMAIN_BLOCK_TYPE = /** @type {const} */ ({
  FULL: "full",
  MEDIA_ONLY: "media_only",
  REPORT_REJECT: "report_reject",
});

/**
 * @typedef {Object} BlockedDomainDocument
 * @property {string}                                                                              id              - Document ID (from snapshot.id).
 * @property {string}                                                                              domain          - The blocked domain (e.g., "spam-site.com"). Must be unique.
 * @property {typeof BLOCKED_DOMAIN_BLOCK_TYPE[keyof typeof BLOCKED_DOMAIN_BLOCK_TYPE]}            blockType       - "full", "media_only", or "report_reject".
 * @property {string|null}                                                                         reason          - Why this domain was blocked.
 * @property {string|null}                                                                         publicComment   - Comment visible to users about why the domain is blocked.
 * @property {string|null}                                                                         privateComment  - Internal moderator note. Not visible to users.
 * @property {string}                                                                              createdBy       - FK → users
 * @property {import("firebase/firestore").Timestamp}                                              createdAt
 * @property {import("firebase/firestore").Timestamp}                                              updatedAt
 */

/**
 * @param {Omit<BlockedDomainDocument, "id" | "createdAt" | "updatedAt">} fields
 * @returns {Omit<BlockedDomainDocument, "id">}
 */
export function createBlockedDomain(fields) {
  return {
    domain:         fields.domain,
    blockType:      fields.blockType      ?? BLOCKED_DOMAIN_BLOCK_TYPE.FULL,
    reason:         fields.reason         ?? null,
    publicComment:  fields.publicComment  ?? null,
    privateComment: fields.privateComment ?? null,
    createdBy:      fields.createdBy,
    createdAt:      Timestamp.now(),
    updatedAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("blocked_domains").withConverter(blockedDomainConverter)
 */
export const blockedDomainConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      domain:         data.domain,
      blockType:      data.blockType,
      reason:         data.reason         ?? null,
      publicComment:  data.publicComment  ?? null,
      privateComment: data.privateComment ?? null,
      createdBy:      data.createdBy,
      createdAt:      data.createdAt,
      updatedAt:      data.updatedAt,
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - blocked_domains.domain     ASC  — Unique lookup by domain name.
 *   - blocked_domains.blockType  ASC  — "All full domain blocks."
 *   - blocked_domains.createdBy  ASC  — "All domains blocked by this moderator."
 */
