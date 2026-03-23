// post_media: media attachments (images, videos, gifs) associated with posts.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum MediaType {
    Image, // type: String
    Video,
    Gif,
}

#[spacetimedb::table(name = post_media, public)]
pub struct PostMedia {
    #[primary_key]
    pub id: String, // UUID
    // Composite index: (post_id, position) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub post_id: String, // UUID — FK → posts.id (cascade delete)
    #[index(btree)]
    pub file_id: String, // UUID — FK → files.id (restrict delete)
    pub media_type: MediaType,
    pub width: Option<i32>,
    pub height: Option<i32>,
    pub alt_text: Option<String>,
    pub position: i32,
    pub created_at: Timestamp,
}
