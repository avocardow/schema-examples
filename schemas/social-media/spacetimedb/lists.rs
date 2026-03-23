// lists: user-curated lists for organizing followed accounts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = lists, public)]
pub struct List {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub owner_id: String, // UUID — FK → users.id (cascade delete)
    pub name: String,
    pub description: Option<String>,
    pub is_private: bool,
    pub member_count: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
