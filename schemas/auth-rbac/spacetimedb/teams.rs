// teams: Sub-groups within an organization (e.g., "Engineering", "Marketing").
// Lighter than nested organizations — no billing, SSO, or domain verification.
// Just a way to group members for permissions or notifications.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = teams, public)]
pub struct Team {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub organization_id: String, // FK → organizations.id (cascade delete). Index: "list all teams in this org."

    pub name: String, // Display name (e.g., "Engineering").

    pub slug: String, // URL-safe identifier, unique within the org (e.g., "engineering").

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}

// Unique constraint on (organization_id, slug) enforced at the application layer.
// Slugs must be unique within each org, not globally.
