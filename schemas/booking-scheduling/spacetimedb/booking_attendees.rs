// booking_attendees: Individual attendees associated with a booking.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum AttendeeStatus {
    Confirmed, // type: String
    Cancelled,
    NoShow,
}

#[spacetimedb::table(name = booking_attendees, public)]
pub struct BookingAttendee {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub booking_id: String, // UUID — FK → bookings.id (cascade delete)
    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (set null)
    pub name: String,
    #[index(btree)]
    pub email: String,
    pub phone: Option<String>,
    pub status: AttendeeStatus,
    pub cancelled_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
