// comment_votes: User votes on comments for community ranking.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = comment_votes, public)]
pub struct CommentVote {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub comment_id: String, // FK -> comments.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // FK -> users.id (cascade delete)
    pub value: i32, // Composite unique: (comment_id, user_id)
    pub created_at: Timestamp,
}
