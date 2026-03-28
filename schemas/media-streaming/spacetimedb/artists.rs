// artists: Musical artists and bands with profile information and popularity metrics.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = artists, public)]
pub struct Artist {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub name: String,
    #[unique]
    pub slug: String,
    pub bio: Option<String>,
    pub image_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub banner_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub is_verified: bool,
    pub follower_count: i32,
    pub monthly_listeners: i32,
    #[index(btree)]
    pub popularity: i32,
    pub external_url: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
