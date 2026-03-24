// bookings: Individual appointment bookings between customers and providers.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum BookingStatus {
    Pending, // type: String
    Confirmed,
    Completed,
    Cancelled,
    Declined,
    NoShow,
}

#[derive(SpacetimeType, Clone)]
pub enum BookingSource {
    Online, // type: String
    Manual,
    Api,
    Import,
}

#[derive(SpacetimeType, Clone)]
pub enum BookingPaymentStatus {
    NotRequired, // type: String
    Pending,
    Paid,
    Refunded,
    PartiallyRefunded,
}

#[spacetimedb::table(name = bookings, public)]
pub struct Booking {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub provider_id: String, // UUID — FK → providers.id (restrict delete)
    #[index(btree)]
    pub location_id: Option<String>, // UUID — FK → locations.id (set null)
    #[index(btree)]
    pub customer_id: String, // UUID — FK → users.id (restrict delete)
    pub schedule_id: Option<String>, // UUID — FK → schedules.id (set null)
    pub start_time: Timestamp,
    pub end_time: Timestamp,
    pub timezone: String,
    #[index(btree)]
    pub status: BookingStatus,
    pub cancelled_by: Option<String>, // UUID — FK → users.id (set null)
    pub cancellation_reason: Option<String>,
    pub cancelled_at: Option<Timestamp>,
    pub customer_notes: Option<String>,
    pub provider_notes: Option<String>,
    pub source: BookingSource,
    pub payment_status: BookingPaymentStatus,
    pub recurrence_group_id: Option<String>, // UUID — groups recurring booking instances
    pub recurrence_rule: Option<String>, // RFC 5545 RRULE string
    pub confirmed_at: Option<Timestamp>,
    pub completed_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (provider_id, start_time)
    // Composite index: (customer_id, start_time)
    // Composite index: (start_time, end_time)
}
