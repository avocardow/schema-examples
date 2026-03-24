// project_members: Membership and role assignments for users within projects.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ProjectMemberRole {
    Owner, // type: String
    Admin,
    Member,
    Viewer,
}

#[spacetimedb::table(name = project_members, public)]
pub struct ProjectMember {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub project_id: String, // UUID — FK → projects.id (cascade delete)
    #[index(btree)]
    pub user_id: String, // UUID — FK → users.id (cascade delete)
    pub role: ProjectMemberRole,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite unique: (project_id, user_id)
}
