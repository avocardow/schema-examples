// genres: Music genre classifications for organizing artists and content.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = genres, public)]
pub struct Genre {
    #[primary_key]
    pub id: String, // UUID
    #[unique]
    pub name: String,
    #[unique]
    pub slug: String,
    pub created_at: Timestamp,
}
