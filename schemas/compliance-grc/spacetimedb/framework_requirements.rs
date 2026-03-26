// framework_requirements: Individual requirements within a compliance framework (tree via parent_id).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = framework_requirements, public)]
pub struct FrameworkRequirement {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub framework_id: String, // UUID — FK → frameworks.id (cascade delete)

    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → framework_requirements.id (cascade delete) [self-ref]

    pub identifier: String, // Composite unique: (framework_id, identifier)

    pub title: String,

    pub description: Option<String>,

    #[index(btree)]
    pub sort_order: i32, // Defaults to 0.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
