// user_roles: Assigns environment-level (app-wide) roles to users.
// For organization-scoped roles, see organization_members.role_id instead.
// This table is for roles like "super admin" that apply across the entire application.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = user_roles, public)]
pub struct UserRole {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete). Index: "what roles does this user have?"

    #[index(btree)]
    pub role_id: String, // FK → roles.id (restrict delete). Index: "which users have this role?"

    pub assigned_by: Option<String>, // FK → users.id (set null on delete). Who granted this role. Null if system-assigned.

    pub created_at: Timestamp,
}

// Unique constraint on (user_id, role_id) enforced at the application layer.
// A user cannot hold the same role twice.
