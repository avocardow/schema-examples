// comments: Threaded user comments on posts with moderation support.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum CommentStatus {
    Pending,   // type: String
    Approved,
    Rejected,
    Spam,
}

#[spacetimedb::table(name = comments, public)]
pub struct Comment {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub post_id: String, // FK -> posts.id (cascade delete)
    #[index(btree)]
    pub parent_id: Option<String>, // FK -> comments.id (cascade delete)
    #[index(btree)]
    pub author_id: Option<String>, // FK → users.id (set null on delete)
    pub author_name: String,
    pub author_email: Option<String>,
    pub content: String,
    pub status: CommentStatus, // Composite index: (post_id, status, created_at)
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
