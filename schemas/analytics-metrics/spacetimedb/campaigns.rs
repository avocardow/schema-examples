// campaigns: Marketing campaign tracking with UTM-style source, medium, and term fields.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique constraint (not expressible inline):
// - unique(source, medium, name)

#[spacetimedb::table(name = campaigns, public)]
pub struct Campaign {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    pub source: String,

    pub medium: String,
    pub term: Option<String>,
    pub content: Option<String>,
    pub landing_url: Option<String>,

    #[index(btree)]
    pub is_active: bool,

    #[index(btree)]
    pub created_by: String, // UUID, FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
