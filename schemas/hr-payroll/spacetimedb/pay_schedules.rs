// pay_schedules: Defines payroll cadence (weekly, biweekly, etc.) with anchor dates.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PayScheduleFrequency {
    Weekly,
    Biweekly,
    Semimonthly,
    Monthly,
}

#[spacetimedb::table(name = pay_schedules, public)]
pub struct PaySchedule {
    #[primary_key]
    pub id: String, // UUID auto-generated

    pub name: String,

    #[index(btree)]
    pub frequency: PayScheduleFrequency,

    pub anchor_date: String, // ISO 8601 date

    #[index(btree)]
    pub is_active: bool, // default true

    pub description: Option<String>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
