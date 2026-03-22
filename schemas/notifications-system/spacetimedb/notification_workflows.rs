// notification_workflows: Orchestration definitions for multi-step notification delivery.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = notification_workflows, public)]
pub struct NotificationWorkflow {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,

    #[unique]
    pub slug: String,

    pub description: Option<String>,

    #[index(btree)]
    pub category_id: Option<String>, // UUID — FK → notification_categories.id (set_null delete)

    pub is_critical: bool,  // Default false. Bypasses user preferences entirely.

    #[index(btree)]
    pub is_active: bool,    // Default true. Toggle a workflow without deleting it.

    #[unique]
    pub trigger_identifier: String, // Used in API/SDK calls to fire this workflow.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
