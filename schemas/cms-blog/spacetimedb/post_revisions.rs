// post_revisions: Immutable content snapshots for post version history.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = post_revisions, public)]
pub struct PostRevision {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub post_id: String, // FK -> posts.id (cascade delete)
    pub revision_number: i32, // Composite unique: (post_id, revision_number)
    pub title: String,
    pub content: Option<String>,
    pub excerpt: Option<String>,
    pub created_by: String, // FK → users.id (restrict delete)
    pub created_at: Timestamp,
}
