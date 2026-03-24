// booking_custom_field_answers: Customer responses to custom intake fields for a booking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = booking_custom_field_answers, public)]
pub struct BookingCustomFieldAnswer {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub booking_id: String, // UUID — FK → bookings.id (cascade delete)
    #[index(btree)]
    pub custom_field_id: String, // UUID — FK → custom_fields.id (cascade delete)
    pub value: String,
    pub created_at: Timestamp,
    // Composite unique: (booking_id, custom_field_id)
}
