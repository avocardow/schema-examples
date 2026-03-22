// notification_events: Append-only event records that trigger notifications.
// One document per occurrence — the "event" half of the event → notification split.
// See README.md for full design rationale.

import { Timestamp } from "firebase/firestore";

/**
 * Collection: "notification_events"
 * Document ID: Firestore auto-generated or UUID
 *
 * Design notes:
 *   - Events are immutable (append-only). No updatedAt — if the trigger context
 *     needs to change, create a new event.
 *   - actorId / targetId are intentionally not foreign keys — actors and targets
 *     can be any entity type (user, system, API key, comment, invoice, etc.).
 *   - data contains the full payload needed to render notification templates.
 *     Individual notifications don't duplicate it.
 *   - idempotencyKey prevents duplicate events from the same trigger.
 */

/**
 * @typedef {Object} NotificationEventDocument
 * @property {string}         id               - Document ID (from snapshot.id).
 * @property {string}         categoryId       - FK → notification_categories. What kind of event (e.g., "comments", "billing").
 * @property {string|null}    actorType        - What kind of entity triggered the event, e.g., "user", "system", "api_key", "service".
 * @property {string|null}    actorId          - The actor's ID. Not a FK — actors can be any entity type.
 * @property {string|null}    targetType       - Type of the affected resource, e.g., "comment", "invoice", "pull_request".
 * @property {string|null}    targetId         - The target's ID. Not a FK — targets can be any entity type.
 * @property {string|null}    threadKey        - Lightweight grouping key for related events, e.g., "issue:456", "pr:789".
 * @property {string|null}    workflowId       - FK → notification_workflows. Null if not triggered via a workflow.
 * @property {Object|null}    data             - Event payload for rendering notification templates.
 * @property {string|null}    idempotencyKey   - Deterministic dedup key. Null = no dedup.
 * @property {Timestamp|null} expiresAt        - When this event becomes stale. Null = never expires.
 * @property {Timestamp}      createdAt        - When the event occurred. Immutable.
 */

/**
 * @param {Omit<NotificationEventDocument, "id" | "createdAt">} fields
 * @returns {Omit<NotificationEventDocument, "id">}
 */
export function createNotificationEvent(fields) {
  return {
    categoryId:     fields.categoryId,
    actorType:      fields.actorType      ?? null,
    actorId:        fields.actorId        ?? null,
    targetType:     fields.targetType     ?? null,
    targetId:       fields.targetId       ?? null,
    threadKey:      fields.threadKey      ?? null,
    workflowId:     fields.workflowId     ?? null,
    data:           fields.data           ?? null,
    idempotencyKey: fields.idempotencyKey ?? null,
    expiresAt:      fields.expiresAt      ?? null,
    createdAt:      Timestamp.now(),
  };
}

/**
 * Firestore data converter for typed reads/writes.
 * Usage: collection("notification_events").withConverter(notificationEventConverter)
 */
export const notificationEventConverter = {
  toFirestore(doc) {
    return { ...doc };
  },
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      id:              snapshot.id,
      categoryId:      data.categoryId,
      actorType:       data.actorType       ?? null,
      actorId:         data.actorId         ?? null,
      targetType:      data.targetType      ?? null,
      targetId:        data.targetId        ?? null,
      threadKey:       data.threadKey       ?? null,
      workflowId:      data.workflowId      ?? null,
      data:            data.data            ?? null,
      idempotencyKey:  data.idempotencyKey  ?? null,
      expiresAt:       data.expiresAt       ?? null,
      createdAt:       data.createdAt,                // Timestamp
    };
  },
};

/**
 * Suggested Firestore indexes (firestore.indexes.json):
 *
 * Single-field:
 *   - notification_events.categoryId   ASC  — "All events of this type."
 *   - notification_events.threadKey    ASC  — "All events in this thread."
 *   - notification_events.createdAt    ASC  — Time-range queries and retention cleanup.
 *
 * Composite:
 *   - notification_events.actorType    ASC
 *     notification_events.actorId      ASC
 *     — "What events did this actor trigger?"
 *
 *   - notification_events.targetType   ASC
 *     notification_events.targetId     ASC
 *     — "What events relate to this target?"
 *
 * Unique:
 *   - notification_events.idempotencyKey — enforced at the application layer or via
 *     Security Rules; Firestore does not support unique constraints natively.
 */
