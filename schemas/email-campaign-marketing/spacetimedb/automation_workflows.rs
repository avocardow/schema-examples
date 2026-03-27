// automation_workflows: Configurable automated email sequences triggered by events.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TriggerType {
    // type: String
    ListJoin,
    TagAdded,
    Manual,
    Event,
}

#[spacetimedb::table(name = automation_workflows, public)]
pub struct AutomationWorkflow {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,

    #[index(btree)]
    pub trigger_type: String, // TriggerType enum

    pub trigger_config: Option<String>, // JSON

    #[index(btree)]
    pub is_active: bool,

    pub created_by: Option<String>, // UUID, FK → users.id (set null)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
