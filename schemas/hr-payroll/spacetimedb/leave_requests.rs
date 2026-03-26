// leave_requests: Employee leave/time-off requests with approval workflow.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

// type: String
#[derive(SpacetimeType, Clone)]
pub enum LeaveRequestStatus {
    Pending,
    Approved,
    Rejected,
    Cancelled,
}

#[spacetimedb::table(name = leave_requests, public)]
pub struct LeaveRequest {
    #[primary_key]
    pub id: String, // UUID auto-generated

    #[index(btree)]
    pub employee_id: String, // UUID — FK → employees.id (cascade delete)

    #[index(btree)]
    pub leave_policy_id: String, // UUID — FK → leave_policies.id (restrict delete)

    #[index(btree)]
    pub start_date: String,

    pub end_date: String,

    pub days_requested: f64,

    #[index(btree)]
    pub status: LeaveRequestStatus, // default: Pending

    pub reason: Option<String>,

    pub reviewer_id: Option<String>, // UUID — FK → users.id (set null)

    pub reviewed_at: Option<Timestamp>,

    pub reviewer_note: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
