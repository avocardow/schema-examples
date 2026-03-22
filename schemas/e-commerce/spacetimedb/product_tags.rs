// product_tags: Lightweight labels for flexible, user-facing product categorization.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = product_tags, public)]
pub struct ProductTag {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,

    pub created_at: Timestamp,
}
