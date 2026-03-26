// watchlists: Per-user auction watch list with outbid and ending-soon notification preferences.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = watchlists, public)]
pub struct Watchlist {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // UUID, FK → users.id (cascade delete)

    #[index(btree)]
    pub auction_id: String, // UUID, FK → auctions.id (cascade delete)

    pub notify_outbid: bool,  // default: true
    pub notify_ending: bool,  // default: true

    pub created_at: Timestamp,

    // Composite unique: (user_id, auction_id) — enforce in reducer logic
}
