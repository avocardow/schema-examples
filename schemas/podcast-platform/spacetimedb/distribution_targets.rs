// distribution_targets: External platform distribution status for shows.
// See README.md for full design rationale.

use spacetimedb::SpacetimeType;
use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum DistributionStatus {
    Pending, // type: String
    Active,
    Rejected,
    Suspended,
}

#[spacetimedb::table(name = distribution_targets, public)]
pub struct DistributionTarget {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub show_id: String, // UUID — FK → shows.id (cascade delete)
    #[index(btree)]
    pub platform: String,
    pub external_id: Option<String>,
    #[index(btree)]
    pub status: DistributionStatus,
    pub feed_url_override: Option<String>,
    pub submitted_at: Option<Timestamp>,
    pub approved_at: Option<Timestamp>,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
// Composite index: (show_id, platform) — not supported, enforce in reducer logic
