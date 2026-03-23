// list_members: users added to curated lists.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = list_members, public)]
pub struct ListMember {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (list_id, user_id) — enforce in reducer logic.
    #[index(btree)]
    pub list_id: String, // UUID — FK → lists.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub created_at: Timestamp,
}
