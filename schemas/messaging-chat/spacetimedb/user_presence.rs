// user_presence: tracks online status, availability, and last activity for each user.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum PresenceStatus {
    Online, // type: String
    Away,
    Busy,
    Offline,
}

#[spacetimedb::table(name = user_presence, public)]
pub struct UserPresence {
    #[primary_key]
    pub id: String, // UUID

    // FK: references users(id) on delete cascade
    #[unique]
    pub user_id: String, // UUID

    #[index(btree)]
    pub status: PresenceStatus,

    pub status_text: Option<String>,

    pub status_emoji: Option<String>,

    #[index(btree)]
    pub last_active_at: Option<Timestamp>, // microseconds since epoch (nullable)

    pub last_connected_at: Option<Timestamp>, // microseconds since epoch (nullable)

    pub created_at: Timestamp, // microseconds since epoch, default now

    pub updated_at: Timestamp, // microseconds since epoch, default now, on update
}
