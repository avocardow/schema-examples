// albums: Music albums, singles, EPs, and compilations released by artists.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum AlbumType {
    Album, // type: String
    Single,
    Ep,
    Compilation,
}

#[spacetimedb::table(name = albums, public)]
pub struct Album {
    #[primary_key]
    pub id: String, // UUID
    pub title: String,
    #[unique]
    pub slug: String,
    #[index(btree)]
    pub artist_id: String, // UUID — FK → artists.id (cascade delete)
    #[index(btree)]
    pub label_id: Option<String>, // UUID — FK → labels.id (set null on delete)
    pub album_type: AlbumType,
    pub cover_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    #[index(btree)]
    pub release_date: Option<String>,
    pub total_tracks: i32,
    pub total_duration_ms: i32,
    pub upc: Option<String>,
    pub copyright: Option<String>,
    #[index(btree)]
    pub popularity: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite index: (artist_id, release_date) — not supported in SpacetimeDB; document only.
// Composite index: (album_type, release_date) — not supported in SpacetimeDB; document only.
