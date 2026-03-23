// follow_requests: pending, approved, or rejected follow requests for private profiles.
// See README.md for full design rationale.

use spacetimedb::{SpacetimeType, Timestamp};

#[derive(SpacetimeType, Clone)]
pub enum FollowRequestStatus {
    Pending, // type: String
    Approved,
    Rejected,
}

#[spacetimedb::table(name = follow_requests, public)]
pub struct FollowRequest {
    #[primary_key]
    pub id: String, // UUID
    // Composite unique: (requester_id, target_id) — enforce in reducer logic.
    #[index(btree)]
    pub requester_id: String, // UUID — FK → users.id (cascade delete)
    // Composite index: (target_id, status) — not supported in SpacetimeDB; document only.
    #[index(btree)]
    pub target_id: String, // UUID — FK → users.id (cascade delete)
    pub status: FollowRequestStatus,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
