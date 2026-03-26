// controls: Security and compliance controls with type, category, and effectiveness tracking.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ControlType {
    Preventive,  // type: String
    Detective,
    Corrective,
    Directive,
}

#[derive(SpacetimeType, Clone)]
pub enum ControlCategory {
    Technical,   // type: String
    Administrative,
    Physical,
}

#[derive(SpacetimeType, Clone)]
pub enum ControlFrequency {
    Continuous,  // type: String
    Daily,
    Weekly,
    Monthly,
    Quarterly,
    Annually,
    AsNeeded,
}

#[derive(SpacetimeType, Clone)]
pub enum ControlStatus {
    Draft,       // type: String
    Active,
    Inactive,
    Deprecated,
}

#[derive(SpacetimeType, Clone)]
pub enum ControlEffectiveness {
    Effective,           // type: String
    PartiallyEffective,
    Ineffective,
    NotAssessed,
}

#[spacetimedb::table(name = controls, public)]
pub struct Control {
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
    pub control_type: ControlType,

    #[index(btree)]
    pub category: ControlCategory,

    pub frequency: ControlFrequency, // Defaults to Continuous.

    #[index(btree)]
    pub status: ControlStatus, // Defaults to Draft.

    pub effectiveness: ControlEffectiveness, // Defaults to NotAssessed.

    pub implementation_notes: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
