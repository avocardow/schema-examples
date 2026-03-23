// post_reports: user-submitted reports on posts for moderation review.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PostReportReason {
    Spam, // type: String
    Harassment,
    HateSpeech,
    Violence,
    Misinformation,
    Nsfw,
    Other,
}

#[derive(SpacetimeType, Clone)]
pub enum PostReportStatus {
    Pending, // type: String
    Reviewed,
    Resolved,
    Dismissed,
}

#[spacetimedb::table(name = post_reports, public)]
pub struct PostReport {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (post_id, reporter_id) — enforce in reducer logic.
    #[index(btree)]
    pub post_id: String, // UUID — FK → posts.id (cascade delete)
    #[index(btree)]
    pub reporter_id: String, // UUID — FK → users.id (cascade delete)
    pub reason: PostReportReason,
    pub description: Option<String>,
    #[index(btree)]
    pub status: PostReportStatus,
    #[index(btree)]
    pub reviewed_by: Option<String>, // UUID — FK → users.id (set null on delete)
    pub reviewed_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
