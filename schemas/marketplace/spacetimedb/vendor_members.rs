// vendor_members: Team members and their roles within a vendor organization.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum VendorMemberRole {
    Owner,
    Admin,
    Editor,
    Viewer,
}

// Composite unique: (vendor_id, user_id)

#[spacetimedb::table(name = vendor_members, public)]
pub struct VendorMember {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub vendor_id: String, // UUID, FK -> vendors.id (cascade delete)

    #[index(btree)]
    pub user_id: String, // UUID, FK -> users.id (cascade delete)

    pub role: VendorMemberRole,
    pub invited_by: Option<String>, // UUID, FK -> users.id (set null)
    pub joined_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
