// meeting_polls: polls created by hosts during a meeting for audience feedback.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PollType {
    SingleChoice, // type: String
    MultipleChoice,
}

#[derive(SpacetimeType, Clone)]
pub enum PollStatus {
    Draft, // type: String
    Active,
    Closed,
}

// Composite index (meeting_id, poll_status) — not supported in SpacetimeDB

#[spacetimedb::table(name = meeting_polls, public)]
pub struct MeetingPoll {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    pub created_by: String, // UUID — FK → users.id (cascade delete)
    pub question: String,
    pub options: String, // JSON stored as string
    pub poll_type: PollType,
    pub poll_status: PollStatus,
    pub launched_at: Option<Timestamp>,
    pub closed_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
