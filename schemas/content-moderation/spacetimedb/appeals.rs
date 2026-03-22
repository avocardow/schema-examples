// appeals: User appeals against moderation actions.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// Appeal status state machine: pending -> approved or rejected.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum AppealStatus {
    Pending,
    Approved,
    Rejected,
}

#[spacetimedb::table(name = appeals, public)]
pub struct Appeal {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub moderation_action_id: String, // UUID — FK → moderation_actions.id (restrict delete)

    #[index(btree)]
    pub appellant_id: String, // FK → users.id (cascade delete)

    pub appeal_text: String,

    #[index(btree)]
    pub status: AppealStatus,

    #[index(btree)]
    pub reviewer_id: Option<String>, // UUID — FK → users.id (set null)

    pub reviewer_notes: Option<String>,
    pub reviewed_at: Option<Timestamp>,

    #[index(btree)]
    pub created_at: Timestamp,
}
