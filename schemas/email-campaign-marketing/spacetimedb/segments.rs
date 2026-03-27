// segments: Dynamic contact groups defined by filter criteria.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = segments, public)]
pub struct Segment {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,

    pub filter_criteria: String, // JSON

    #[index(btree)]
    pub created_by: Option<String>, // UUID, FK → users.id (set null)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
