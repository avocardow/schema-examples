// rooms: virtual meeting rooms that host video conferences.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum RoomType {
    Permanent, // type: String
    Temporary,
}

#[spacetimedb::table(name = rooms, public)]
pub struct Room {
    #[primary_key]
    pub id: String, // UUID
    pub name: String,
    #[unique]
    pub slug: String,
    pub description: Option<String>,
    #[index(btree)]
    pub room_type: RoomType,
    pub max_participants: Option<i32>,
    pub enable_waiting_room: bool,
    pub enable_recording: bool,
    pub enable_chat: bool,
    pub enable_transcription: bool,
    pub enable_breakout_rooms: bool,
    #[index(btree)]
    pub is_private: bool,
    pub password_hash: Option<String>,
    #[index(btree)]
    pub created_by: String, // UUID — FK → users.id (restrict delete)
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
