// quiet_hours: Per-user Do Not Disturb schedules with timezone support.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = quiet_hours, public)]
pub struct QuietHours {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete)

    // IANA timezone (e.g., "America/New_York"). Quiet hours are evaluated in the user's local time.
    pub timezone: String,

    // Local times in HH:MM format. Cross-midnight works naturally: start=22:00, end=08:00.
    pub start_time: String, // HH:MM
    pub end_time: String,   // HH:MM

    // ISO day numbers (1=Monday … 7=Sunday). E.g., [1,2,3,4,5] = weekdays only.
    pub days_of_week: Vec<u8>,

    pub is_active: bool, // default true — toggle without deleting.

    // Ad-hoc snooze: temporary DND override regardless of schedule. Null = no active snooze.
    pub snooze_until: Option<Timestamp>,

    pub created_at: Timestamp,
    pub updated_at: Timestamp,

    // index(user_id, is_active) — composite index enforced at application level.
}
