// notifications: Per-recipient notification record.
// One row per recipient per event. Tracks delivery status and engagement status as separate concerns.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

// type: String
#[derive(SpacetimeType, Clone)]
pub enum DeliveryStatus {
    Pending,
    Queued,
    Sent,
    Delivered,
    Failed,
    Canceled,
}

#[spacetimedb::table(name = notifications, public)]
pub struct Notification {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_id: String, // FK → notification_events.id (cascade delete)

    // Polymorphic recipient: who this notification is for.
    // Can be a user, a team, an organization — any entity that has a notification inbox.
    // Composite index(recipient_type, recipient_id, read_at) — enforce in application queries.
    // Composite index(recipient_type, recipient_id, created_at) — enforce in application queries.
    // Composite index(recipient_type, recipient_id, seen_at) — enforce in application queries.
    #[index(btree)]
    pub recipient_type: String, // e.g., "user", "team", "organization".

    #[index(btree)]
    pub recipient_id: String, // Not a FK — recipients can be any entity type.

    pub reason: Option<String>, // e.g., "mention", "assign", "review_requested", "subscription".

    #[index(btree)]
    pub delivery_status: DeliveryStatus, // pending → queued → sent → delivered | failed | canceled.

    // Engagement timestamps: nullable, can coexist.
    pub seen_at: Option<Timestamp>,       // Appeared in feed. Drives "unseen" badge count.
    pub read_at: Option<Timestamp>,       // Explicitly opened/clicked. NULL = unread.
    pub interacted_at: Option<Timestamp>, // Primary action performed (e.g., CTA click).
    pub archived_at: Option<Timestamp>,   // Soft archive. Hidden from default feed.

    #[index(btree)]
    pub expires_at: Option<Timestamp>, // After this time, notification should not be displayed.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
