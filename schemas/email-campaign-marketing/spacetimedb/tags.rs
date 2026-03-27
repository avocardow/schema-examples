// tags: Labels that can be applied to contacts for categorization.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = tags, public)]
pub struct Tag {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String,

    pub description: Option<String>,

    pub created_by: Option<String>, // UUID, FK → users.id (set null)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
