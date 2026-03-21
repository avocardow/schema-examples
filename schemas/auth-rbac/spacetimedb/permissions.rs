// permissions: Granular capabilities using "resource:action" naming convention.
// Assigned to roles (not directly to users) to keep the RBAC model manageable.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = permissions, public)]
pub struct Permission {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub slug: String, // Structured key: "resource:action" (e.g., "posts:create", "billing:read").

    pub name: String, // Display name (e.g., "Create Posts").

    pub description: Option<String>,

    // Groups permissions by resource (e.g., "posts", "users", "billing").
    // Useful for building permission UIs: "Posts: ☑ create ☑ read ☐ delete".
    #[index(btree)]
    pub resource_type: Option<String>,

    pub created_at: Timestamp,
}
