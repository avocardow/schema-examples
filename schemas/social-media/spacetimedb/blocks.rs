// blocks: user-to-user block relationships.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = blocks, public)]
pub struct Block {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (blocker_id, blocked_id) — enforce in reducer logic.
    #[index(btree)]
    pub blocker_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub blocked_id: String, // UUID — FK → users.id (cascade delete)
    pub created_at: Timestamp,
}
