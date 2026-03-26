// risks: Organizational risks with likelihood, impact scoring, and treatment strategy.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum RiskCategory {
    Strategic,   // type: String
    Operational,
    Financial,
    Compliance,
    Reputational,
    Technical,
    ThirdParty,
}

#[derive(SpacetimeType, Clone)]
pub enum RiskLevel {
    Critical,    // type: String
    High,
    Medium,
    Low,
    VeryLow,
}

#[derive(SpacetimeType, Clone)]
pub enum RiskTreatment {
    Mitigate,    // type: String
    Accept,
    Transfer,
    Avoid,
}

#[derive(SpacetimeType, Clone)]
pub enum RiskStatus {
    Identified,  // type: String
    Assessing,
    Treating,
    Monitoring,
    Closed,
}

#[spacetimedb::table(name = risks, public)]
pub struct Risk {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: Option<String>, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub owner_id: Option<String>, // UUID — FK → users.id (set null)

    #[unique]
    pub identifier: Option<String>,

    pub title: String,

    pub description: Option<String>,

    #[index(btree)]
    pub category: RiskCategory,

    pub likelihood: i32, // 1–5 scale, defaults to 3.

    pub impact: i32, // 1–5 scale, defaults to 3.

    #[index(btree)]
    pub risk_level: RiskLevel, // Defaults to Medium.

    pub treatment: RiskTreatment, // Defaults to Mitigate.

    #[index(btree)]
    pub status: RiskStatus, // Defaults to Identified.

    pub due_date: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
