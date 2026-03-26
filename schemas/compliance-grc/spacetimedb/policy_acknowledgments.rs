// policy_acknowledgments: Tracks user acknowledgment of policy versions.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum AcknowledgmentMethod {
    ClickThrough,        // type: String
    ElectronicSignature,
    Manual,
}

#[spacetimedb::table(name = policy_acknowledgments, public)]
pub struct PolicyAcknowledgment {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub policy_version_id: String, // UUID — FK → policy_versions.id (cascade delete)
    // Composite unique: (policy_version_id, user_id)

    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)

    #[index(btree)]
    pub acknowledged_at: Timestamp,

    pub method: AcknowledgmentMethod, // Defaults to ClickThrough.

    pub ip_address: Option<String>,

    pub notes: Option<String>,

    pub created_at: Timestamp,
}
