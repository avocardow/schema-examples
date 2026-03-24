// tasks: Action items and to-dos assigned to CRM users.
// See README.md for full design rationale.
// Uses DealPriority from deals.rs — do not redefine here.

use spacetimedb::Timestamp;
use crate::deals::DealPriority;

#[derive(SpacetimeType, Clone)]
pub enum TaskStatus {
    Todo, // type: String
    InProgress,
    Completed,
    Cancelled,
}

#[spacetimedb::table(name = tasks, public)]
pub struct Task {
    #[primary_key]
    pub id: String, // UUID
    pub title: String,
    pub description: Option<String>,
    #[index(btree)]
    pub due_date: Option<String>, // YYYY-MM-DD
    pub priority: DealPriority,
    pub status: TaskStatus,
    pub completed_at: Option<Timestamp>,
    #[index(btree)]
    pub contact_id: Option<String>, // UUID — FK → contacts.id (set null)
    pub company_id: Option<String>, // UUID — FK → companies.id (set null)
    #[index(btree)]
    pub deal_id: Option<String>, // UUID — FK → deals.id (set null)
    #[index(btree)]
    pub owner_id: String, // UUID — FK → users.id (cascade delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
