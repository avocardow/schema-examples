// mutes: user-to-user mute relationships with optional expiration.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = mutes, public)]
pub struct Mute {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (muter_id, muted_id) — enforce in reducer logic.
    #[index(btree)]
    pub muter_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub muted_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub expires_at: Option<Timestamp>,
    pub created_at: Timestamp,
}
