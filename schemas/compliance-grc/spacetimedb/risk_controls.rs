// risk_controls: Maps risks to mitigating controls (many-to-many).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = risk_controls, public)]
pub struct RiskControl {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub risk_id: String, // UUID — FK → risks.id (cascade delete)
    // Composite unique: (risk_id, control_id)

    #[index(btree)]
    pub control_id: String, // UUID — FK → controls.id (cascade delete)

    pub effectiveness_notes: Option<String>,

    pub created_at: Timestamp,
}
