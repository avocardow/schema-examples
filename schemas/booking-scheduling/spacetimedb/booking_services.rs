// booking_services: Snapshot of services and addons included in a booking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = booking_services, public)]
pub struct BookingService {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub booking_id: String, // UUID — FK → bookings.id (cascade delete)
    #[index(btree)]
    pub service_id: Option<String>, // UUID — FK → services.id (set null)
    pub addon_id: Option<String>, // UUID — FK → service_addons.id (set null)
    pub service_name: String,
    pub duration: i32,
    pub price: Option<String>, // Decimal
    pub currency: Option<String>,
    pub is_primary: bool,
    pub position: i32,
    pub created_at: Timestamp,
}
