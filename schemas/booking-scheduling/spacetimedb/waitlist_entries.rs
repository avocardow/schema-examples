// waitlist_entries: Customers waiting for availability on a specific service and date.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum WaitlistStatus {
    Waiting, // type: String
    Notified,
    Booked,
    Expired,
    Cancelled,
}

#[spacetimedb::table(name = waitlist_entries, public)]
pub struct WaitlistEntry {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub service_id: String, // UUID — FK → services.id (cascade delete)
    pub provider_id: Option<String>, // UUID — FK → providers.id (cascade delete)
    #[index(btree)]
    pub customer_id: String, // UUID — FK → users.id (cascade delete)
    pub location_id: Option<String>, // UUID — FK → locations.id (set null)
    pub preferred_date: String,
    pub preferred_start: Option<String>,
    pub preferred_end: Option<String>,
    #[index(btree)]
    pub status: WaitlistStatus,
    pub notified_at: Option<Timestamp>,
    pub expires_at: Option<Timestamp>,
    pub notes: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (service_id, preferred_date, status)
    // Composite index: (customer_id, status)
    // Composite index: (status, notified_at)
}
