// comments: Threaded comments on assets for collaboration.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = comments, public)]
pub struct Comment {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub asset_id: String, // FK → assets.id (cascade delete)

    // Index: parent_id — enforce in query/reducer logic
    pub parent_id: Option<String>, // UUID — FK → comments.id (cascade delete). None = top-level comment.

    pub body: String,

    #[index(btree)]
    pub author_id: String, // FK → users.id (cascade delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
