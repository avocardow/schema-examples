// moderator_performance: Pre-aggregated moderator performance metrics.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[spacetimedb::table(name = moderator_performance, public)]
pub struct ModeratorPerformance {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub moderator_id: String, // FK → users.id (cascade delete)

    #[index(btree)]
    pub period_start: Timestamp,
    #[index(btree)]
    pub period_end: Timestamp,
    // Composite unique: (moderator_id, period_start, period_end) — enforce in reducer logic

    pub items_reviewed: i32,
    pub items_actioned: i32,
    pub average_review_time_seconds: i32,
    pub appeals_overturned: i32,
    pub accuracy_score: f64,

    pub computed_at: Timestamp,
    pub created_at: Timestamp,
}
