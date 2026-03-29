// collections: User-curated groups of recipes.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = collections, public)]
pub struct Collection {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,
    pub cover_image_url: Option<String>,
    pub is_public: bool, // default false
    pub recipe_count: i32, // default 0

    #[index(btree)]
    pub created_by: String, // FK → users.id

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
