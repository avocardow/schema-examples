// policy_versions: Versioned policy content with approval workflow.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PolicyVersionStatus {
    Draft,    // type: String
    InReview,
    Approved,
    Archived,
}

#[spacetimedb::table(name = policy_versions, public)]
pub struct PolicyVersion {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub policy_id: String, // UUID — FK → policies.id (cascade delete)
    // Composite unique: (policy_id, version_number)

    pub version_number: String,

    pub content: Option<String>,

    pub file_id: Option<String>, // UUID — FK → files.id (set null)

    #[index(btree)]
    pub status: PolicyVersionStatus, // Defaults to Draft.

    #[index(btree)]
    pub approved_by: Option<String>, // UUID — FK → users.id (set null)

    pub approved_at: Option<Timestamp>,

    pub effective_date: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
