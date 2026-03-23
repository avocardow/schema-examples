// polls: polls attached to posts with voting options and counts.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = polls, public)]
pub struct Poll {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub author_id: String, // UUID — FK → users.id (cascade delete)
    pub allows_multiple: bool,
    pub options: String, // JSON array of option strings
    pub vote_count: i32,
    pub voter_count: i32,
    #[index(btree)]
    pub closes_at: Option<Timestamp>,
    pub is_closed: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
