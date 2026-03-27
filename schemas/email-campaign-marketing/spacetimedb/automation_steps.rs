// automation_steps: Ordered actions within an automation workflow.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum StepType {
    // type: String
    SendEmail,
    Delay,
    Condition,
}

#[spacetimedb::table(name = automation_steps, public)]
pub struct AutomationStep {
    #[primary_key]
    pub id: String, // UUID

    pub workflow_id: String, // UUID, FK → automation_workflows.id (cascade delete)
    // Composite unique: (workflow_id, step_order) — enforce in reducer logic

    pub step_order: i32,

    pub step_type: String, // StepType enum

    #[index(btree)]
    pub template_id: Option<String>, // UUID, FK → templates.id (set null)

    pub config: Option<String>, // JSON

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
