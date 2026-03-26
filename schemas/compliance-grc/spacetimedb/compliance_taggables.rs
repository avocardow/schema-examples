// compliance_taggables: Polymorphic join table linking tags to compliance entities.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum TaggableType {
    Control,  // type: String
    Risk,
    Policy,
    Audit,
    Finding,
    Evidence,
}

#[spacetimedb::table(name = compliance_taggables, public)]
pub struct ComplianceTaggable {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub tag_id: String, // UUID — FK → compliance_tags.id (cascade delete)
    // Composite unique: (tag_id, taggable_type, taggable_id)

    #[index(btree)]
    pub taggable_type: TaggableType,

    #[index(btree)]
    pub taggable_id: String, // UUID — polymorphic, no FK constraint

    pub created_at: Timestamp,
}
