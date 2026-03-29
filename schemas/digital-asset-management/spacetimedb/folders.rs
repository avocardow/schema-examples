// folders: Folder tree with materialized path for organizing assets within a workspace.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique(workspace_id, path) — enforce in reducer logic
// Composite unique(workspace_id, parent_id, name) — enforce in reducer logic
// Composite index(workspace_id, depth) — btree on workspace_id covers prefix

#[spacetimedb::table(name = folders, public)]
pub struct Folder {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub workspace_id: String, // FK → workspaces.id (cascade delete)

    #[index(btree)]
    pub parent_id: Option<String>, // UUID — FK → folders.id (cascade delete). None = root-level folder.

    pub name: String,
    pub path: String,
    pub depth: i32, // default 0
    pub description: Option<String>,

    pub created_by: String, // FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
