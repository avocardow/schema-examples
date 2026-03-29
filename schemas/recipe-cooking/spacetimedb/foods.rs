// foods: Canonical ingredient names for normalization across recipes.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = foods, public)]
pub struct Food {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String,

    #[index(btree)]
    pub category: Option<String>,

    pub created_at: Timestamp,
}
