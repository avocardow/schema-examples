// moderator_assignments: Default routing of content to moderators.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

/// What this assignment covers.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModeratorAssignmentScope {
    Community,
    Channel,
    Category,
}

/// Authority level within the assignment scope.
// type: String
#[derive(SpacetimeType, Clone)]
pub enum ModeratorAssignmentRole {
    Moderator,
    SeniorModerator,
    Admin,
}

// Composite unique: (moderator_id, scope, scope_id) — enforce in reducer logic

#[spacetimedb::table(name = moderator_assignments, public)]
pub struct ModeratorAssignment {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub moderator_id: String, // UUID — FK → users.id (cascade delete)

    #[index(btree)]
    pub scope: ModeratorAssignmentScope,

    #[index(btree)]
    pub scope_id: String, // ID of the community, channel, or violation category.

    pub role: ModeratorAssignmentRole,

    #[index(btree)]
    pub is_active: bool,

    pub assigned_at: Timestamp,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
