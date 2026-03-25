// canned_responses: Pre-written reply templates for common ticket scenarios.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = canned_responses, public)]
pub struct CannedResponse {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    pub content: String,
    #[index(btree)]
    pub folder: Option<String>,
    #[index(btree)]
    pub created_by_id: String, // UUID — FK → users.id (restrict)
    #[index(btree)]
    pub is_shared: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
