// audit_logs: Immutable event log for security-relevant actions.
// Append-only — never update or delete rows.
// Uses polymorphic actor/target (not FKs) so logs survive entity deletion.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum AuditActorType {
    User,
    System,
    ApiKey,
    Service,
}

#[spacetimedb::table(name = audit_logs, public)]
pub struct AuditLog {
    #[primary_key]
    pub id: String, // UUID

    // Structured event codes: resource.action.result
    // e.g., "user.login.success", "role.assigned", "session.impersonation.started"
    #[index(btree)]
    pub event_type: String,

    // Polymorphic actor: NOT FKs. Audit logs must survive deletion of the actor.
    // Composite index(actor_type, actor_id) — enforce in application queries.
    pub actor_type: AuditActorType,

    #[index(btree)]
    pub actor_id: Option<String>, // user_id, api_key_id, or service name.

    // Polymorphic target: what was acted upon.
    // Composite index(target_type, target_id) — enforce in application queries.
    #[index(btree)]
    pub target_type: Option<String>, // e.g., "user", "organization", "role".

    #[index(btree)]
    pub target_id: Option<String>,

    // on_delete set_null (not cascade) — audit logs must survive org deletion.
    // Composite index(organization_id, created_at) — enforce in application queries.
    #[index(btree)]
    pub organization_id: Option<String>, // FK → organizations.id (set null on delete)

    pub ip_address: Option<String>,
    pub user_agent: Option<String>,

    pub metadata: Option<String>, // JSON. Event-specific details (e.g., {"old_role": "member", "new_role": "admin"}).

    #[index(btree)]
    pub created_at: Timestamp, // Immutable. Audit logs are append-only.
}
