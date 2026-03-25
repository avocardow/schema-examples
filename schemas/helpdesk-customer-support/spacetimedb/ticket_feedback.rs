// ticket_feedback: Customer satisfaction ratings on resolved tickets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TicketFeedbackRating {
    Good, // type: String
    Bad,
}

#[spacetimedb::table(name = ticket_feedback, public)]
pub struct TicketFeedback {
    #[primary_key]
    pub id: String, // UUID
    #[unique]
    pub ticket_id: String, // UUID — FK → tickets.id (cascade delete)
    #[index(btree)]
    pub rating: TicketFeedbackRating,
    pub comment: Option<String>,
    #[index(btree)]
    pub created_by_id: String, // UUID — FK → users.id (restrict)
    pub created_at: Timestamp,
}
