// file_locks: Collaborative file locking to prevent concurrent edits — one lock per file.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// type: String
#[derive(SpacetimeType, Clone)]
pub enum LockType {
    Exclusive,
    Shared,
}

#[spacetimedb::table(name = file_locks, public)]
pub struct FileLock {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub file_id: String, // FK → files.id (cascade delete) — only one lock per file at a time.

    #[index(btree)]
    pub locked_by: String, // FK → users.id (cascade delete)

    pub lock_type: LockType, // Default: Exclusive

    pub reason: Option<String>, // Why the file is locked.

    #[index(btree)]
    pub expires_at: Option<Timestamp>, // Null = indefinite.

    pub created_at: Timestamp,
    // No updated_at — locks are short-lived; to extend, release and re-acquire.
}
