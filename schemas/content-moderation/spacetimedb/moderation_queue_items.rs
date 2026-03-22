// moderation_queue_items: Central moderation queue for content review.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// What type of content is being reviewed.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationQueueContentType {
    Post,
    Comment,
    Message,
    User,
    Media,
}

/// How this item entered the queue.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationQueueSource {
    UserReport,
    AutoDetection,
    Manual,
}

/// Lifecycle status of the queue item.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationQueueStatus {
    Pending,
    InReview,
    Resolved,
    Escalated,
}

/// Queue ordering priority.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationQueuePriority {
    Low,
    Medium,
    High,
    Critical,
}

/// Final outcome of moderation review.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModerationQueueResolution {
    Approved,
    Removed,
    Escalated,
}

#[spacetimedb::table(name = moderation_queue_items, public)]
pub struct ModerationQueueItem {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub content_type: ModerationQueueContentType,

    #[index(btree)]
    pub content_id: String, // ID of the flagged content. String, not UUID — supports external ID formats.

    #[index(btree)]
    pub source: ModerationQueueSource,

    #[index(btree)]
    pub status: ModerationQueueStatus,

    pub priority: ModerationQueuePriority,

    #[index(btree)]
    pub assigned_moderator_id: Option<String>, // UUID — FK → users.id (set null on delete)

    pub content_snapshot: Option<String>, // JSON. Frozen copy of content at time of flagging.

    pub report_count: i32, // Denormalized from reports table for queue sorting.

    pub resolution: Option<ModerationQueueResolution>, // Null = not yet resolved.

    pub resolved_at: Option<Timestamp>,

    pub resolved_by: Option<String>, // UUID — FK → users.id (set null on delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
