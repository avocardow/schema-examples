// finding_remediations: Remediation tasks assigned to resolve audit findings.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum RemediationStatus {
    Pending,    // type: String
    InProgress,
    Completed,
    Cancelled,
}

#[derive(SpacetimeType, Clone)]
pub enum RemediationPriority {
    Critical,   // type: String
    High,
    Medium,
    Low,
}

#[spacetimedb::table(name = finding_remediations, public)]
pub struct FindingRemediation {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub finding_id: String, // UUID — FK → audit_findings.id (cascade delete)

    #[index(btree)]
    pub assigned_to: Option<String>, // UUID — FK → users.id (set null)

    pub title: String,

    pub description: Option<String>,

    #[index(btree)]
    pub status: RemediationStatus, // Defaults to Pending.

    #[index(btree)]
    pub priority: RemediationPriority, // Defaults to Medium.

    #[index(btree)]
    pub due_date: Option<String>,

    pub completed_at: Option<Timestamp>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
