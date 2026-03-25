// business_schedule_holidays: Non-working days within a business schedule.
// See README.md for full design rationale.

#[spacetimedb::table(name = business_schedule_holidays, public)]
pub struct BusinessScheduleHoliday {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub schedule_id: String, // UUID — FK → business_schedules.id (cascade delete)
    pub name: String,
    pub date: String,
    // Composite unique: (schedule_id, date) — not supported inline, enforce in application
}
