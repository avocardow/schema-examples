// file_comments: Threaded comments on files — supports nested replies via parent_id self-reference and resolved state for review workflows.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = file_comments, public)]
pub struct FileComment {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub file_id: String, // UUID — FK → files.id (cascade delete)

    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → file_comments.id (cascade delete). Null = top-level comment.

    #[index(btree)]
    pub author_id: String, // UUID — FK → users.id (restrict delete)

    pub body: String, // Comment text. Supports plain text or markdown.

    pub is_resolved: bool, // Whether this comment thread is resolved. Default false in app logic.

    pub created_at: Timestamp,
    pub updated_at: Timestamp, // Comments can be edited.
}
