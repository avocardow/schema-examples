// audit_findings: Issues discovered during audits with severity and remediation status.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum FindingSeverity {
    Critical,      // type: String
    High,
    Medium,
    Low,
    Informational,
}

#[derive(SpacetimeType, Clone)]
pub enum FindingStatus {
    Open,        // type: String
    InProgress,
    Remediated,
    Accepted,
    Closed,
}

#[spacetimedb::table(name = audit_findings, public)]
pub struct AuditFinding {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub audit_id: String, // UUID — FK → audits.id (cascade delete)

    #[index(btree)]
    pub control_id: Option<String>, // UUID — FK → controls.id (set null)

    #[index(btree)]
    pub risk_id: Option<String>, // UUID — FK → risks.id (set null)

    pub title: String,

    pub description: Option<String>,

    #[index(btree)]
    pub severity: FindingSeverity,

    #[index(btree)]
    pub status: FindingStatus, // Defaults to Open.

    pub due_date: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
