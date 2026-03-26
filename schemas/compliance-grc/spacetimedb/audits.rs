// audits: Compliance audits with type, scope, and lifecycle tracking.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum AuditType {
    Internal,       // type: String
    External,
    SelfAssessment,
    Certification,
}

#[derive(SpacetimeType, Clone)]
pub enum AuditStatus {
    Planned,    // type: String
    InProgress,
    Review,
    Completed,
    Cancelled,
}

#[spacetimedb::table(name = audits, public)]
pub struct Audit {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: Option<String>, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub lead_auditor_id: Option<String>, // UUID — FK → users.id (set null)

    pub title: String,

    #[index(btree)]
    pub audit_type: AuditType,

    #[index(btree)]
    pub status: AuditStatus, // Defaults to Planned.

    pub scope: Option<String>,

    pub start_date: Option<String>,

    pub end_date: Option<String>,

    pub conclusion: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
