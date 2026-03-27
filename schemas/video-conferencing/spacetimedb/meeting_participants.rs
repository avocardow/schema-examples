// meeting_participants: users who have joined a meeting session.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum ParticipantRole {
    Host, // type: String
    CoHost,
    Moderator,
    Attendee,
    Viewer,
}

// Composite unique (meeting_id, user_id) — enforce in reducer logic

#[spacetimedb::table(name = meeting_participants, public)]
pub struct MeetingParticipant {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (set null on delete)
    pub display_name: String,
    pub participant_role: ParticipantRole,
    pub joined_at: Timestamp,
    pub left_at: Option<Timestamp>,
    pub duration_seconds: Option<i32>,
    pub is_camera_on: bool,
    pub is_mic_on: bool,
    pub is_screen_sharing: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
