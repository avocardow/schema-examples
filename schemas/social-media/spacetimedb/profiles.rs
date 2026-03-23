// profiles: user profile information including display name, bio, and social stats.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = profiles, public)]
pub struct Profile {
    #[primary_key]
    pub id: String, // UUID
    #[unique]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub display_name: Option<String>,
    pub bio: Option<String>,
    pub avatar_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub banner_file_id: Option<String>, // UUID — FK → files.id (set null on delete)
    pub website: Option<String>,
    pub location: Option<String>,
    #[index(btree)]
    pub is_private: bool,
    pub follower_count: i32,
    pub following_count: i32,
    pub post_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
