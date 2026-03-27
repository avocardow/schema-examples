// poll_responses: individual user responses to meeting polls.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique (poll_id, user_id) — enforce in reducer logic

#[spacetimedb::table(name = poll_responses, public)]
pub struct PollResponse {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub poll_id: String, // UUID — FK → meeting_polls.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub selected_options: String, // JSON stored as string
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
