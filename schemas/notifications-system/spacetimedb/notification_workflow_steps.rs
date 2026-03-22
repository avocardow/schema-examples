// notification_workflow_steps: Individual steps within a workflow, executing in order by step_order.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

// type: String
#[derive(SpacetimeType, Clone)]
pub enum WorkflowStepType {
    Channel,   // Deliver to a specific channel.
    Delay,     // Wait for a duration before proceeding.
    Digest,    // Batch/accumulate events within a time window.
    Condition, // Evaluate a rule; skip remaining steps if false.
    Throttle,  // Limit delivery frequency (e.g., max 1 per hour).
}

// type: String
#[derive(SpacetimeType, Clone)]
pub enum ChannelType {
    Email,
    Sms,
    Push,
    InApp,
    Chat,
    Webhook,
}

#[spacetimedb::table(name = notification_workflow_steps, public)]
pub struct NotificationWorkflowStep {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workflow_id: String, // FK → notification_workflows.id (cascade delete)

    // Execution order within the workflow. Steps run in ascending order.
    pub step_order: i32,

    // What this step does.
    pub step_type: WorkflowStepType,

    // For channel steps: which channel type to deliver to. Null for non-channel step types.
    pub channel_type: Option<ChannelType>,

    // Step configuration as JSON. Schema depends on step_type.
    pub config: Option<String>, // JSON

    // Should the workflow stop if this step fails?
    // true = abort remaining steps (fail-fast). false = continue to next step (best-effort).
    pub should_stop_on_fail: bool,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // unique(workflow_id, step_order) — enforced at application level.
}
