// tickets: Core support tickets submitted by users and managed by agents.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TicketType {
    Question, // type: String
    Incident,
    Problem,
    FeatureRequest,
}

#[derive(SpacetimeType, Clone)]
pub enum TicketSource {
    Email, // type: String
    Web,
    Phone,
    Api,
    Social,
}

#[spacetimedb::table(name = tickets, public)]
pub struct Ticket {
    #[primary_key]
    pub id: String, // UUID
    pub subject: String,
    pub description: Option<String>,
    #[index(btree)]
    pub status_id: String, // UUID — FK → ticket_statuses.id (restrict)
    #[index(btree)]
    pub priority_id: String, // UUID — FK → ticket_priorities.id (restrict)
    pub ticket_type: TicketType,
    pub source: TicketSource,
    #[index(btree)]
    pub category_id: Option<String>, // UUID — FK → ticket_categories.id (set null)
    #[index(btree)]
    pub requester_id: String, // UUID — FK → users.id (restrict)
    #[index(btree)]
    pub assigned_agent_id: Option<String>, // UUID — FK → users.id (set null)
    #[index(btree)]
    pub assigned_team_id: Option<String>, // UUID — references auth-rbac teams externally
    #[index(btree)]
    pub sla_policy_id: Option<String>, // UUID — FK → sla_policies.id (set null)
    #[index(btree)]
    pub due_at: Option<Timestamp>,
    pub first_response_at: Option<Timestamp>,
    pub resolved_at: Option<Timestamp>,
    pub closed_at: Option<Timestamp>,
    pub created_by: String, // UUID — FK → users.id (restrict)
    #[index(btree)]
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
