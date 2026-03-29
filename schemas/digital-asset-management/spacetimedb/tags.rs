// tags: Workspace-scoped labels for categorizing assets.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(workspace_id, name) — enforce in reducer logic

#[spacetimedb::table(name = tags, public)]
pub struct Tag {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workspace_id: String, // FK → workspaces.id (cascade delete)

    pub name: String,

    pub created_at: Timestamp,
}
