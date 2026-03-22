// funnel_steps: Ordered steps within a funnel, each tied to an event type.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique constraints (not expressible inline):
// - unique(funnel_id, step_order)
// - unique(funnel_id, event_type_id)

#[spacetimedb::table(name = funnel_steps, public)]
pub struct FunnelStep {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub funnel_id: String, // UUID, FK → funnels.id (cascade delete)

    pub event_type_id: String, // UUID, FK → event_types.id (restrict delete)
    pub step_order: i32,
    pub name: Option<String>,
    pub created_at: Timestamp,
}
