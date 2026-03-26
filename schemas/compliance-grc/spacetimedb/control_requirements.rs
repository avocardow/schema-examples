// control_requirements: Maps controls to framework requirements (many-to-many).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = control_requirements, public)]
pub struct ControlRequirement {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub control_id: String, // UUID — FK → controls.id (cascade delete)
    // Composite unique: (control_id, requirement_id)

    #[index(btree)]
    pub requirement_id: String, // UUID — FK → framework_requirements.id (cascade delete)

    pub notes: Option<String>,

    pub created_at: Timestamp,
}
