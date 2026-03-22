// translation_comments: Discussion threads on translations.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite index: (translation_type, translation_id) — all comments on a translation

#[spacetimedb::table(name = translation_comments, public)]
pub struct TranslationComment {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub translation_type: String,

    pub translation_id: String,

    #[index(btree)]
    pub parent_id: Option<String>, // FK → translation_comments.id (cascade delete)

    #[index(btree)]
    pub author_id: String, // FK → users.id (cascade delete)

    pub body: String,
    pub issue_type: Option<String>,
    pub is_resolved: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
