// events: Individual tracked events with context, location, and device metadata.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite indexes (not expressible inline):
// - idx_events_user_timestamp: (user_id, timestamp)
// - idx_events_type_timestamp: (event_type_id, timestamp)

#[spacetimedb::table(name = events, public)]
pub struct Event {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub event_type_id: String, // UUID, FK → event_types.id (restrict delete)

    #[index(btree)]
    pub user_id: Option<String>, // UUID, FK → users.id (set null)

    #[index(btree)]
    pub anonymous_id: Option<String>,

    #[index(btree)]
    pub session_id: Option<String>, // UUID, FK → sessions.id (set null)

    #[index(btree)]
    pub timestamp: Timestamp,
    pub ip_address: Option<String>,
    pub user_agent: Option<String>,
    pub device_type: Option<String>,
    pub os: Option<String>,
    pub browser: Option<String>,

    #[index(btree)]
    pub country: Option<String>,

    pub region: Option<String>,
    pub city: Option<String>,
    pub locale: Option<String>,
    pub referrer: Option<String>,

    #[index(btree)]
    pub campaign_id: Option<String>, // UUID, FK → campaigns.id (set null)

    pub properties: Option<String>, // JSON
    pub created_at: Timestamp,
}
