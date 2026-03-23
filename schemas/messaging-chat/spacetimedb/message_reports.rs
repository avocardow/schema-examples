// message_reports: tracks user reports on messages for moderation review.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum MessageReportReason {
    Spam, // type: String
    Harassment,
    HateSpeech,
    Violence,
    Misinformation,
    Nsfw,
    Other,
}

#[derive(SpacetimeType, Clone)]
pub enum MessageReportStatus {
    Pending, // type: String
    Reviewed,
    Resolved,
    Dismissed,
}

#[spacetimedb::table(name = message_reports, public)]
pub struct MessageReport {
    #[primary_key]
    pub id: String, // UUID

    // FK → messages.id (cascade delete)
    #[index(btree)]
    pub message_id: String, // UUID

    // FK → users.id (cascade delete)
    #[index(btree)]
    pub reporter_id: String, // UUID

    pub reason: MessageReportReason,

    pub description: Option<String>,

    // default: MessageReportStatus::Pending
    #[index(btree)]
    pub status: MessageReportStatus,

    // FK → users.id (set null on delete)
    #[index(btree)]
    pub reviewed_by: Option<String>, // UUID

    pub reviewed_at: Option<Timestamp>, // microseconds since epoch (nullable)

    pub created_at: Timestamp, // microseconds since epoch

    pub updated_at: Timestamp, // microseconds since epoch, updated on change

    // COMPOSITE UNIQUE: (message_id, reporter_id) — enforced in application logic
}
