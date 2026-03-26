// compliance_tags: Tagging taxonomy for organizing compliance entities.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = compliance_tags, public)]
pub struct ComplianceTag {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: Option<String>, // UUID — FK → organizations.id (cascade delete)
    // Composite unique: (organization_id, name)

    pub name: String,

    pub color: Option<String>,

    pub created_at: Timestamp,
}
