// recording_access_grants: permissions granted to users for accessing recordings.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum RecordingPermission {
    View, // type: String
    Download,
}

// Composite unique (recording_id, granted_to) — enforce in reducer logic

#[spacetimedb::table(name = recording_access_grants, public)]
pub struct RecordingAccessGrant {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub recording_id: String, // UUID — FK → recordings.id (cascade delete)
    #[index(btree)]
    pub granted_to: String, // UUID — FK → users.id (cascade delete)
    pub granted_by: String, // UUID — FK → users.id (cascade delete)
    pub permission: RecordingPermission,
    pub expires_at: Option<Timestamp>,
    pub created_at: Timestamp,
}
