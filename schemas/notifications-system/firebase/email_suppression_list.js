// email_suppression_list: Email addresses that should not be sent to. Prevents bounces, spam complaints, and unsubscribe violations.
// See README.md for full design rationale and field documentation.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "email_suppression_list"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - Check this collection before every email delivery to protect sender reputation.
 *   - Respect manual_unsubscribe and spam_complaint entries permanently — never send again.
 *   - Soft bounce entries may have an expiresAt for automatic retry after a cooling period.
 *   - One entry per email per reason (composite unique on email + reason).
 */

/**
 * @typedef {"hard_bounce"|"soft_bounce"|"spam_complaint"|"manual_unsubscribe"|"invalid_address"} SuppressionReason
 */

export const SUPPRESSION_REASONS = /** @type {const} */ ({
  HARD_BOUNCE:        "hard_bounce",
  SOFT_BOUNCE:        "soft_bounce",
  SPAM_COMPLAINT:     "spam_complaint",
  MANUAL_UNSUBSCRIBE: "manual_unsubscribe",
  INVALID_ADDRESS:    "invalid_address",
});

/**
 * @typedef {"provider_webhook"|"user_action"|"admin"|"system"} SuppressionSource
 */

export const SUPPRESSION_SOURCES = /** @type {const} */ ({
  PROVIDER_WEBHOOK: "provider_webhook",
  USER_ACTION:      "user_action",
  ADMIN:            "admin",
  SYSTEM:           "system",
});

/**
 * @typedef {Object} EmailSuppressionListDocument
 * @property {string}              email          - The suppressed email address. Lowercase, trimmed.
 * @property {SuppressionReason}   reason         - Why this address is suppressed (hard_bounce, soft_bounce, spam_complaint, manual_unsubscribe, invalid_address).
 * @property {SuppressionSource}   source         - How this suppression was created (provider_webhook, user_action, admin, system).
 * @property {string|null}         channelId      - Which provider/channel reported the suppression. Null if not webhook-sourced.
 * @property {Object|null}         details        - Provider-specific details for debugging (e.g., bounce_type, provider_message).
 * @property {Timestamp}           suppressedAt   - When the suppression took effect. May differ from createdAt if back-dated from provider data.
 * @property {Timestamp|null}      expiresAt      - Null = permanent suppression. Set for soft bounces that should be retried.
 * @property {Timestamp}           createdAt
 */

/**
 * @param {Omit<EmailSuppressionListDocument, "createdAt">} fields
 * @returns {Omit<EmailSuppressionListDocument, "id">}
 */
export function createEmailSuppressionList(fields) {
  return {
    email:        fields.email,
    reason:       fields.reason,
    source:       fields.source,
    channelId:    fields.channelId    ?? null,
    details:      fields.details      ?? null,
    suppressedAt: fields.suppressedAt ?? Timestamp.now(),
    expiresAt:    fields.expiresAt    ?? null,
    createdAt:    Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("email_suppression_list").withConverter(emailSuppressionListConverter)
 */
export const emailSuppressionListConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:           snapshot.id,
      email:        data.email,
      reason:       data.reason,
      source:       data.source,
      channelId:    data.channelId    ?? null,
      details:      data.details      ?? null,
      suppressedAt: data.suppressedAt,               // Timestamp
      expiresAt:    data.expiresAt    ?? null,        // Timestamp | null
      createdAt:    data.createdAt,                   // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - email_suppression_list.email      ASC  — "Is this email suppressed?" (checked before every email delivery).
 *   - email_suppression_list.reason     ASC  — "All hard bounces" (for reporting).
 *   - email_suppression_list.expiresAt  ASC  — Cleanup job: remove expired soft bounce suppressions.
 *
 * Composite unique:
 *   - (email, reason) — One entry per email per reason. Enforce in application logic or security rules.
 */
