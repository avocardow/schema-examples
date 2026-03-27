// automation_enrollments: Tracks contact progress through automation workflows.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum EnrollmentStatus {
    // type: String
    Active,
    Completed,
    Paused,
    Exited,
}

#[spacetimedb::table(name = automation_enrollments, public)]
pub struct AutomationEnrollment {
    #[primary_key]
    pub id: String, // UUID

    pub workflow_id: String, // UUID, FK → automation_workflows.id (cascade delete)
    // Composite unique: (workflow_id, contact_id) — enforce in reducer logic

    #[index(btree)]
    pub contact_id: String, // UUID, FK → contacts.id (cascade delete)

    pub current_step_id: Option<String>, // UUID, FK → automation_steps.id (set null)

    #[index(btree)]
    pub status: String, // EnrollmentStatus enum

    pub enrolled_at: Timestamp,
    pub completed_at: Option<Timestamp>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
