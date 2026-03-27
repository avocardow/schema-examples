// meeting_invitations: invitations sent to users for upcoming meetings.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum InvitationStatus {
    Pending, // type: String
    Accepted,
    Declined,
    Tentative,
}

// Composite unique (meeting_id, invitee_id) — enforce in reducer logic

#[spacetimedb::table(name = meeting_invitations, public)]
pub struct MeetingInvitation {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub meeting_id: String, // UUID — FK → meetings.id (cascade delete)
    pub inviter_id: String, // UUID — FK → users.id (cascade delete)
    #[index(btree)]
    pub invitee_id: String, // UUID — FK → users.id (cascade delete)
    pub invitation_status: InvitationStatus,
    pub responded_at: Option<Timestamp>,
    pub message: Option<String>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
