// sla_policies: Service level agreements defining response and resolution targets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = sla_policies, public)]
pub struct SlaPolicy {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    pub description: Option<String>,
    #[index(btree)]
    pub is_active: bool,
    pub sort_order: i32,
    // Composite index: (is_active, sort_order) — enforce in reducer logic
    pub schedule_id: Option<String>, // UUID — FK → business_schedules.id (set null)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
