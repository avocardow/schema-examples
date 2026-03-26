// compliance_activities: Audit trail of compliance-related actions across all entity types.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ActivityType {
    ControlCreated,      // type: String
    ControlUpdated,
    ControlTested,
    RiskCreated,
    RiskUpdated,
    RiskClosed,
    PolicyCreated,
    PolicyApproved,
    PolicyAcknowledged,
    AuditStarted,
    AuditCompleted,
    FindingCreated,
    FindingRemediated,
    FindingClosed,
    EvidenceCollected,
}

#[derive(SpacetimeType, Clone)]
pub enum ActivityEntityType {
    Control,            // type: String
    Risk,
    Policy,
    PolicyVersion,
    Audit,
    AuditFinding,
    FindingRemediation,
    Evidence,
}

#[spacetimedb::table(name = compliance_activities, public)]
pub struct ComplianceActivity {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: Option<String>, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub actor_id: Option<String>, // UUID — FK → users.id (set null)

    #[index(btree)]
    pub activity_type: ActivityType,

    #[index(btree)]
    pub entity_type: ActivityEntityType,

    #[index(btree)]
    pub entity_id: String, // UUID — polymorphic, no FK constraint

    pub summary: String,

    pub details: Option<String>, // JSON

    #[index(btree)]
    pub created_at: Timestamp,
}
