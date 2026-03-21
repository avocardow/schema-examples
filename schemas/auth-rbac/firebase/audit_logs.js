// audit_logs: Append-only event log for security-relevant actions across the system.
// Never update or delete audit log documents — they are the immutable record of what happened.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "audit_logs"
 * Document ID: Firestore auto-generated or UUID
 *
 * Security notes:
 *   - Audit logs are append-only. Security Rules must deny update and delete operations.
 *   - actorId is intentionally not a foreign key — the referenced user or key may be
 *     deleted, but the audit trail must survive.
 *   - metadata may contain PII (email, IP). Apply retention policies per your compliance needs.
 *   - ipAddress and userAgent storage may be subject to GDPR/CCPA. Review before enabling.
 */

/**
 * @typedef {"user"|"system"|"api_key"|"service"} AuditActorType
 */

export const AUDIT_ACTOR_TYPES = /** @type {const} */ ({
  USER:    "user",
  SYSTEM:  "system",
  API_KEY: "api_key",
  SERVICE: "service",
});

/**
 * @typedef {Object} AuditLogDocument
 * @property {string}         eventType       - Dot-notation event name, e.g., "user.login.success", "role.permission.added".
 * @property {AuditActorType}      actorType  - What kind of entity performed the action.
 * @property {string|null}    actorId         - ID of the actor. Not a FK — the actor may be deleted later.
 * @property {string|null}    targetType      - Type of the affected resource, e.g., "user", "organization".
 * @property {string|null}    targetId        - ID of the affected resource.
 * @property {string|null}    organizationId  - Scopes the event to an organization. Null = platform-level.
 * @property {string|null}    ipAddress       - Client IP. Consider privacy regulations before storing.
 * @property {string|null}    userAgent       - Client user-agent string.
 * @property {Object|null}    metadata        - Arbitrary event-specific data (old/new values, reason, etc.).
 * @property {Timestamp}      createdAt       - When the event occurred. Immutable.
 */

/**
 * @param {Omit<AuditLogDocument, "createdAt">} fields
 * @returns {Omit<AuditLogDocument, "id">}
 */
export function createAuditLog(fields) {
  return {
    eventType:      fields.eventType,
    actorType:      fields.actorType,
    actorId:        fields.actorId        ?? null,
    targetType:     fields.targetType     ?? null,
    targetId:       fields.targetId       ?? null,
    organizationId: fields.organizationId ?? null,
    ipAddress:      fields.ipAddress      ?? null,
    userAgent:      fields.userAgent      ?? null,
    metadata:       fields.metadata       ?? null,
    createdAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("audit_logs").withConverter(auditLogConverter)
 */
export const auditLogConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:             snapshot.id,
      eventType:      data.eventType,
      actorType:      data.actorType,
      actorId:        data.actorId        ?? null,
      targetType:     data.targetType     ?? null,
      targetId:       data.targetId       ?? null,
      organizationId: data.organizationId ?? null,
      ipAddress:      data.ipAddress      ?? null,
      userAgent:      data.userAgent      ?? null,
      metadata:       data.metadata       ?? null,
      createdAt:      data.createdAt,              // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - audit_logs.eventType  ASC  — "List all events of this type."
 *   - audit_logs.createdAt  ASC  — "Recent events" and cleanup queries.
 *
 * Composite:
 *   - audit_logs.actorType       ASC
 *     audit_logs.actorId         ASC
 *     — "What did this actor do?"
 *
 *   - audit_logs.targetType      ASC
 *     audit_logs.targetId        ASC
 *     — "What happened to this resource?"
 *
 *   - audit_logs.organizationId  ASC
 *     audit_logs.createdAt       ASC
 *     — "Organization activity feed, ordered by time."
 */
