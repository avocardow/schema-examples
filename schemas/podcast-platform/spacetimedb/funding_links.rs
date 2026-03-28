// funding_links: External funding and donation links associated with a show.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = funding_links, public)]
pub struct FundingLink {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub show_id: String, // UUID — FK → shows.id (cascade delete)
    pub url: String,
    pub title: String,
    pub position: i32,
    pub created_at: Timestamp,
}
// Composite index: (show_id, position) — not supported, enforce in reducer logic
