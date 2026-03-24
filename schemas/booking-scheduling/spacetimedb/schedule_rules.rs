// schedule_rules: Recurring weekly availability rules within a schedule.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = schedule_rules, public)]
pub struct ScheduleRule {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub schedule_id: String, // UUID — FK → schedules.id (cascade delete)
    pub day_of_week: i32,
    pub start_time: String,
    pub end_time: String,
    pub created_at: Timestamp,
    // Composite index: (schedule_id, day_of_week)
}
