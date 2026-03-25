// sla_policy_targets: Response and resolution time targets per priority within an SLA policy.
// See README.md for full design rationale.

#[spacetimedb::table(name = sla_policy_targets, public)]
pub struct SlaPolicyTarget {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub sla_policy_id: String, // UUID — FK → sla_policies.id (cascade delete)
    pub priority_id: String, // UUID — FK → ticket_priorities.id (cascade delete)
    // Composite unique: (sla_policy_id, priority_id) — not supported inline, enforce in application
    pub first_response_minutes: Option<i32>,
    pub next_response_minutes: Option<i32>,
    pub resolution_minutes: Option<i32>,
}
