// tags: Content tags for flexible post classification.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = tags, public)]
pub struct Tag {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    pub slug: String, // Unique
    pub description: Option<String>,
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
