// team_members: Links users to teams with an optional lightweight role string.
// Simpler than organization_members — no status lifecycle or directory management.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = team_members, public)]
pub struct TeamMember {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub team_id: String, // FK → teams.id (cascade delete). Index: "list all members of this team."

    #[index(btree)]
    pub user_id: String, // FK → users.id (cascade delete). Index: "which teams is this user on?"

    pub role: Option<String>, // Simple team role (e.g., "lead", "member"). Not a FK — intentionally lightweight.

    pub created_at: Timestamp,
}

// Unique constraint on (team_id, user_id) enforced at the application layer.
// A user can only be in a team once.
