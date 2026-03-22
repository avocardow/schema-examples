// notification_workflow_runs: Execution instances of a workflow, tracking state for monitoring, debugging, and retry.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum WorkflowRunStatus {
    Pending,   // Run created, not yet started.
    Running,   // Actively executing steps.
    Completed, // All steps finished successfully.
    Failed,    // A step failed and should_stop_on_fail was true, or a fatal error occurred.
    Canceled,  // Manually canceled or event expired before completion.
}
// type: String

#[spacetimedb::table(name = notification_workflow_runs, public)]
pub struct NotificationWorkflowRun {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workflow_id: String, // FK → notification_workflows.id (cascade delete)

    #[index(btree)]
    pub event_id: String, // FK → notification_events.id (cascade delete)

    // Execution lifecycle.
    #[index(btree)]
    pub status: WorkflowRunStatus, // default: Pending

    // Which step the workflow is currently on (or last completed).
    pub current_step_order: Option<i32>,

    // Error details if the run failed.
    pub error_message: Option<String>,
    pub error_step_id: Option<String>, // UUID — FK → notification_workflow_steps.id (set_null delete)

    pub started_at: Option<Timestamp>,
    pub completed_at: Option<Timestamp>,

    #[index(btree)]
    pub created_at: Timestamp,

    pub updated_at: Timestamp,
}
