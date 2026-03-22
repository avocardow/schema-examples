// moderation_action_log: Immutable audit trail of moderation events.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = moderation_action_log, public)]
pub struct ModerationActionLog {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub actor_id: String, // FK → users.id (restrict delete)

    #[index(btree)]
    pub action_type: String, // What happened (e.g., "report_created", "action_taken", "appeal_decided", "rule_updated").
                             // Intentionally not an enum — new action types should not require schema migration.

    #[index(btree)]
    pub target_type: String, // What entity the action was on (e.g., "queue_item", "report", "user", "moderation_rule", "policy").
                             // Intentionally not an enum — same rationale as action_type.

    #[index(btree)]
    pub target_id: String, // ID of the target entity. Not a FK — target may be any entity type.

    pub details: Option<String>, // JSON. Event-specific context (e.g., action_taken: {"action_type": "ban", "reason": "...", "duration": "24h"}).

    pub ip_address: Option<String>, // Client IP address for security audit.

    #[index(btree)]
    pub created_at: Timestamp, // Immutable. Actions are append-only — no updated_at.
}
