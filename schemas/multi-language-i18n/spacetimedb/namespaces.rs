// namespaces: Logical groupings for translation keys.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = namespaces, public)]
pub struct Namespace {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String,

    pub description: Option<String>,
    pub is_default: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
