// notification_events: Immutable event log for notification triggers.
// One row per occurrence — per-recipient state lives in the notifications table.
// Uses polymorphic actor/target (not FKs) so events survive entity deletion.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[spacetimedb::table(name = notification_events, public)]
pub struct NotificationEvent {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub category_id: String, // FK → notification_categories.id (restrict delete)

    // Polymorphic actor: who/what triggered this event.
    // Follows Activity Streams 2.0 pattern (actor/verb/object/target).
    // Composite index(actor_type, actor_id) — enforce in application queries.
    #[index(btree)]
    pub actor_type: Option<String>, // e.g., "user", "system", "api_key", "service"

    #[index(btree)]
    pub actor_id: Option<String>,

    // Polymorphic target: what was acted upon.
    // Composite index(target_type, target_id) — enforce in application queries.
    #[index(btree)]
    pub target_type: Option<String>, // e.g., "comment", "invoice", "pull_request"

    #[index(btree)]
    pub target_id: Option<String>,

    // Threading: lightweight grouping for related events.
    #[index(btree)]
    pub thread_key: Option<String>, // e.g., "issue:456", "pr:789"

    pub workflow_id: Option<String>, // FK → notification_workflows.id (set null on delete)

    pub data: Option<String>, // JSON. Event payload for rendering notification templates.

    #[unique]
    pub idempotency_key: Option<String>, // Dedup key. Null = no dedup.

    pub expires_at: Option<Timestamp>,

    #[index(btree)]
    pub created_at: Timestamp, // Immutable. Events are append-only — no updated_at.
}
