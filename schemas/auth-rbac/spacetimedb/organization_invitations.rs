// organization_invitations: Pending invitations to join an organization.
// Separate from organization_members because an invitee may not have an account yet.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum InvitationStatus {
    Pending,
    Accepted,
    Expired,
    Revoked, // An admin cancelled it before the invitee accepted.
}

#[spacetimedb::table(name = organization_invitations, public)]
pub struct OrganizationInvitation {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: String, // FK → organizations.id (cascade delete)

    #[index(btree)]
    pub email: String, // Invitee's email. They may or may not have an account yet.

    pub role_id: String, // FK → roles.id (restrict delete). Role granted upon acceptance.

    pub status: InvitationStatus, // index(organization_id, status) for pending invitation listing.

    #[unique]
    pub token_hash: String, // Hashed invitation token. The raw token is sent in the invite email.

    pub inviter_id: Option<String>, // FK → users.id (set null on delete). Null if system-generated.

    pub expires_at: Timestamp, // Typically 7 days. After this, a new invitation must be requested.

    pub accepted_at: Option<Timestamp>, // When the invitee accepted.

    pub created_at: Timestamp,
}
