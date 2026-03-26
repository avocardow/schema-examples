// session_speakers: Links speakers to sessions with their role and order.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum SpeakerRole {
    Speaker, // type: String
    Moderator,
    Panelist,
    Host,
    Keynote,
}

#[spacetimedb::table(name = session_speakers, public)]
pub struct SessionSpeaker {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub session_id: String, // UUID — FK → event_sessions.id (cascade delete)

    #[index(btree)]
    pub speaker_id: String, // UUID — FK → speakers.id (cascade delete)

    pub role: SpeakerRole,
    pub position: i32,
    pub created_at: Timestamp,
    // Composite unique: (session_id, speaker_id)
}
