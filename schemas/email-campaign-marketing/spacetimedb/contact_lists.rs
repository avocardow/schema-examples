// contact_lists: Named lists for grouping contacts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = contact_lists, public)]
pub struct ContactList {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,

    #[index(btree)]
    pub created_by: Option<String>, // UUID, FK → users.id (set null)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
