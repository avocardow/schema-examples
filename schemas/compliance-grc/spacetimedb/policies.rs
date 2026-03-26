// policies: Governance policies, standards, procedures, and guidelines.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PolicyType {
    Policy,     // type: String
    Standard,
    Procedure,
    Guideline,
}

#[derive(SpacetimeType, Clone)]
pub enum ReviewFrequency {
    Monthly,      // type: String
    Quarterly,
    SemiAnnually,
    Annually,
    Biennially,
}

#[spacetimedb::table(name = policies, public)]
pub struct Policy {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: Option<String>, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub owner_id: Option<String>, // UUID — FK → users.id (set null)

    pub title: String,

    #[index(btree)]
    pub policy_type: PolicyType, // Defaults to Policy.

    pub description: Option<String>,

    pub review_frequency: ReviewFrequency, // Defaults to Annually.

    pub next_review_date: Option<String>,

    #[index(btree)]
    pub is_active: bool, // Defaults to true.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
