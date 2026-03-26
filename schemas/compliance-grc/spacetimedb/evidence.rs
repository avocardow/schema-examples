// evidence: Compliance evidence collected for controls and audits.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum EvidenceType {
    Document,      // type: String
    Screenshot,
    LogExport,
    AutomatedTest,
    ManualReview,
    Certification,
}

#[spacetimedb::table(name = evidence, public)]
pub struct Evidence {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub control_id: String, // UUID — FK → controls.id (cascade delete)

    #[index(btree)]
    pub audit_id: Option<String>, // UUID — FK → audits.id (set null)

    pub file_id: Option<String>, // UUID — FK → files.id (set null)

    #[index(btree)]
    pub collected_by: Option<String>, // UUID — FK → users.id (set null)

    pub title: String,

    #[index(btree)]
    pub evidence_type: EvidenceType,

    pub description: Option<String>,

    #[index(btree)]
    pub collected_at: Timestamp,

    pub valid_from: Option<String>,

    pub valid_until: Option<String>,

    pub created_at: Timestamp,
}
