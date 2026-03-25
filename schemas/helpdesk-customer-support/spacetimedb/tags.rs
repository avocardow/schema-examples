// tags: Labels for categorizing and filtering tickets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = tags, public)]
pub struct Tag {
    #[primary_key]
    pub id: String, // UUID
    #[unique]
    pub name: String,
    pub color: Option<String>,
    pub created_at: Timestamp,
}
