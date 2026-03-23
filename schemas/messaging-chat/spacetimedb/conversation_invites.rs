// conversation_invites: tracks invitations sent to users to join a conversation, including status lifecycle and optional expiry.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum InviteStatus {
    Pending, // type: String
    Accepted,
    Declined,
    Expired,
}

// composite_unique(conversation_id, invitee_id, status) — enforced at application level
#[spacetimedb::table(name = conversation_invites, public)]
pub struct ConversationInvite {
    #[primary_key]
    pub id: String, // UUID

    // FK -> conversations(id) ON DELETE CASCADE (enforced at application level)
    #[index(btree)]
    pub conversation_id: String, // UUID

    // FK -> users(id) ON DELETE CASCADE (enforced at application level)
    pub inviter_id: String, // UUID

    // FK -> users(id) ON DELETE CASCADE (enforced at application level)
    #[index(btree)]
    pub invitee_id: String, // UUID

    pub status: InviteStatus, // default: Pending

    pub message: Option<String>,

    #[index(btree)]
    pub expires_at: Option<Timestamp>, // timestamp (microseconds since epoch), nullable

    pub responded_at: Option<Timestamp>, // timestamp (microseconds since epoch), nullable

    pub created_at: Timestamp, // timestamp (microseconds since epoch)

    pub updated_at: Timestamp, // timestamp (microseconds since epoch)
}
