// series: Ordered collections of related posts for multi-part content.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = series, public)]
pub struct Series {
    #[primary_key]
    pub id: String, // UUID
    pub title: String,
    pub slug: String, // Unique
    pub description: Option<String>,
    pub cover_image_url: Option<String>,
    pub is_active: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
