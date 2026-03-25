// ticket_activities: Append-only audit trail of ticket changes for accountability and SLA debugging.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TicketActivityAction {
    Created,
    Updated,
    StatusChanged,
    PriorityChanged,
    Assigned,
    Escalated,
    Reopened,
    Resolved,
    Closed,
    SlaBreached,
}

#[spacetimedb::table(name = ticket_activities, public)]
pub struct TicketActivity {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub ticket_id: String, // UUID — FK → tickets.id (cascade delete)
    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (set null)
    pub action: TicketActivityAction,
    pub field: Option<String>,
    pub old_value: Option<String>,
    pub new_value: Option<String>,
    pub created_at: Timestamp,
    // Composite index: (ticket_id, created_at) — enforce in reducer logic
}
