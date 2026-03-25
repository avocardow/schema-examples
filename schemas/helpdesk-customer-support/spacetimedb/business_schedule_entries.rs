// business_schedule_entries: Daily time windows within a business schedule.
// See README.md for full design rationale.

#[spacetimedb::table(name = business_schedule_entries, public)]
pub struct BusinessScheduleEntry {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub schedule_id: String, // UUID — FK → business_schedules.id (cascade delete)
    pub day_of_week: i32, // Composite index: (schedule_id, day_of_week) — enforce in reducer logic
    pub start_time: String,
    pub end_time: String,
}
