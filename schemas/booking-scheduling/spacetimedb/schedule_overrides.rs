// schedule_overrides: Date-specific availability overrides for a schedule.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = schedule_overrides, public)]
pub struct ScheduleOverride {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub schedule_id: String, // UUID — FK → schedules.id (cascade delete)
    pub override_date: String,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub is_available: bool,
    pub reason: Option<String>,
    pub created_at: Timestamp,
    // Composite index: (schedule_id, override_date)
}
