// departments: Organizational units forming a hierarchy (tree via parent_id).
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = departments, public)]
pub struct Department {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: Option<String>, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → departments.id (set null) [self-ref]

    pub name: String, // Display name (e.g., "Engineering", "Human Resources").

    pub code: Option<String>, // Short code for reporting (e.g., "ENG", "HR").

    pub description: Option<String>,

    #[index(btree)]
    pub is_active: bool, // Defaults to true. Inactive departments are hidden from pickers.

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
