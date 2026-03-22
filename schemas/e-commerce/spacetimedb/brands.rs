// brands: Product brand identity with logo, website, and display ordering.
// See README.md for full design rationale.
use spacetimedb::Timestamp;

#[spacetimedb::table(name = brands, public)]
pub struct Brand {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,
    pub logo_url: Option<String>,
    pub website_url: Option<String>,

    pub is_active: bool, // Composite index: (is_active, sort_order)
    pub sort_order: i32,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
