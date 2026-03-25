// business_schedules: Operating hour schedules for SLA calculation.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = business_schedules, public)]
pub struct BusinessSchedule {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    pub timezone: String,
    pub is_default: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
