// post_slug_history: Historical slug records for redirect support.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = post_slug_history, public)]
pub struct PostSlugHistory {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub post_id: String, // FK -> posts.id (cascade delete)
    pub slug: String, // Unique
    pub changed_at: Timestamp,
}
