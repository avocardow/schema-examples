// booking_reminders: Scheduled reminder notifications for upcoming bookings.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ReminderTarget {
    Customer, // type: String
    Provider,
    All,
}

#[derive(SpacetimeType, Clone)]
pub enum ReminderStatus {
    Pending, // type: String
    Sent,
    Failed,
    Cancelled,
}

#[spacetimedb::table(name = booking_reminders, public)]
pub struct BookingReminder {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub booking_id: String, // UUID — FK → bookings.id (cascade delete)
    pub remind_at: Timestamp,
    pub reminder_type: ReminderTarget,
    pub offset_minutes: i32,
    #[index(btree)]
    pub status: ReminderStatus,
    pub sent_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (status, remind_at)
}
