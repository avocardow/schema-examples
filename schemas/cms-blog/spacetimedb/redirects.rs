// redirects: URL redirect rules for SEO and slug migration.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = redirects, public)]
pub struct Redirect {
    #[primary_key]
    pub id: String, // UUID
    pub source_path: String, // Unique
    pub target_path: String,
    pub status_code: i32,
    #[index(btree)]
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
