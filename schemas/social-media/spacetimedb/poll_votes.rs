// poll_votes: individual user votes on poll options.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = poll_votes, public)]
pub struct PollVote {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (poll_id, user_id, option_index) — enforce in reducer logic.
    #[index(btree)]
    pub poll_id: String, // UUID — FK → polls.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub option_index: i32,
    pub created_at: Timestamp,
}
