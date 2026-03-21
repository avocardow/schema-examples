// organization_members: Links users to organizations with a role.
// The primary multi-tenancy junction table. role_id must reference a role with scope=organization.
// Create this row only when an invitation is accepted (or on SCIM provisioning).
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum MemberStatus {
    Active,   // Normal member.
    Inactive, // Suspended but not removed; preserves history.
}

#[spacetimedb::table(name = organization_members, public)]
pub struct OrganizationMember {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: String, // FK → organizations.id (cascade delete)

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete). Index: "which orgs does this user belong to?"

    pub role_id: String, // FK → roles.id (restrict delete). Must be scope=organization.

    // Composite index(organization_id, status) — enforce in application queries.
    pub status: MemberStatus,

    // If true, this membership is managed by an external directory (Okta, Azure AD, etc.).
    // Directory-managed memberships should not be editable through your app's UI.
    pub directory_managed: bool,

    pub custom_attributes: Option<String>, // JSON. Org-specific metadata (e.g., department, title within the org).

    pub invited_by: Option<String>, // FK → users.id (set null on delete). Who sent the invitation.

    pub joined_at: Option<Timestamp>, // When the user accepted the invitation.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

// Unique constraint on (organization_id, user_id) enforced at the application layer.
// A user can only be a member of an org once.
