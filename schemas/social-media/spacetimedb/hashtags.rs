// hashtags: unique hashtag names with usage counts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = hashtags, public)]
pub struct Hashtag {
    #[primary_key]
    pub id: String, // UUID
    #[unique]
    pub name: String,
    #[index(btree)]
    pub post_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
