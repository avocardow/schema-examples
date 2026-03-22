// file_favorites: Per-user file bookmarks (stars) for "starred files" UIs.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = file_favorites, public)]
pub struct FileFavorite {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    #[index(btree)]
    pub file_id: String, // FK → files.id (cascade delete)

    pub created_at: Timestamp,
}

// Unique constraint on (user_id, file_id) enforced at the application layer.
// SpacetimeDB supports unique on single columns; composite uniqueness requires app-level enforcement.
