// roles: Named sets of permissions with human-readable slugs.
// Two-tier scope: "environment" (app-wide) and "organization" (org-scoped).
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum RoleScope {
    Environment, // App-wide (e.g., super admin, platform support).
    Organization, // Per-org only (e.g., org admin, org editor).
}

#[spacetimedb::table(name = roles, public)]
pub struct Role {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub slug: String, // Human-readable key (e.g., "admin", "org:editor"). Used in code.

    pub name: String, // Display name for admin UIs (e.g., "Administrator").

    pub description: Option<String>, // Explain what this role is for. Shown in role management UI.

    #[index(btree)]
    pub scope: RoleScope, // "environment" = app-wide. "organization" = per-org.

    pub is_system: bool, // System roles cannot be deleted. Prevents accidental lockout.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
