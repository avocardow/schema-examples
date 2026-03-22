// anonymous_ids: Links anonymous visitor identifiers to authenticated user accounts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique constraint (not expressible inline):
// - unique(anonymous_id, user_id)

#[spacetimedb::table(name = anonymous_ids, public)]
pub struct AnonymousId {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub anonymous_id: String,

    #[index(btree)]
    pub user_id: String, // UUID, FK → users.id (cascade delete)

    pub first_seen_at: Timestamp,
    pub identified_at: Timestamp,
    pub created_at: Timestamp,
}
