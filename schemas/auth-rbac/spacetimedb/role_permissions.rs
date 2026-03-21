// role_permissions: Junction table linking roles to permissions (many-to-many).
// Pure join table — no extra fields needed.
// See README.md for full design rationale.

#[spacetimedb::table(name = role_permissions, public)]
pub struct RolePermission {
    // SpacetimeDB does not support composite PKs natively.
    // Surrogate key; composite uniqueness on (role_id, permission_id) enforced at the application layer.
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub role_id: String, // FK → roles.id (cascade delete)

    #[index(btree)]
    pub permission_id: String, // FK → permissions.id (cascade delete). Index for reverse lookup: "which roles have this permission?"
}

// Unique constraint on (role_id, permission_id) enforced at the application layer.
// SpacetimeDB supports unique on single columns; composite uniqueness requires app-level enforcement.
