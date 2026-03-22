// reports: User-submitted content reports.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// What type of content is being reported.
// Uses ContentType from moderation_queue_items.rs
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ReportContentType {
    Post,
    Comment,
    Message,
    User,
    Media,
}

/// Reporter-selected reason category.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ReportCategory {
    Spam,
    Harassment,
    HateSpeech,
    Violence,
    SexualContent,
    Illegal,
    Misinformation,
    SelfHarm,
    Other,
}

/// Current review status of the report.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ReportStatus {
    Pending,
    Reviewed,
    Dismissed,
}

#[spacetimedb::table(name = reports, public)]
pub struct Report {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub reporter_id: String, // FK → users.id (cascade delete)

    #[index(btree)]
    pub content_type: ReportContentType,

    #[index(btree)]
    pub content_id: String, // ID of the reported content. String for external ID support.

    #[index(btree)]
    pub queue_item_id: Option<String>, // UUID — FK → moderation_queue_items.id (set null on delete)

    pub category: ReportCategory,

    pub reason_text: Option<String>,

    pub policy_id: Option<String>, // UUID — FK → moderation_policies.id (set null on delete)

    #[index(btree)]
    pub status: ReportStatus,

    #[index(btree)]
    pub created_at: Timestamp,
}
