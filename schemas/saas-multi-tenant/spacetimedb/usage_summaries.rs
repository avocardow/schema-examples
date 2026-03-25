// usage_summaries: Aggregated usage metrics per organization and feature over a billing period.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique: (organization_id, feature_id, period_start) — enforce in reducer logic.

#[spacetimedb::table(name = usage_summaries, public)]
pub struct UsageSummary {
    #[primary_key]
    pub id: String, // UUID, auto-generated

    #[index(btree)]
    pub organization_id: String, // UUID — FK → organizations.id (cascade delete)

    #[index(btree)]
    pub feature_id: String, // UUID — FK → features.id (cascade delete)

    // Composite index: (period_start, period_end) — enforce in reducer logic
    pub period_start: Timestamp,
    pub period_end: Timestamp,

    pub total_quantity: i64, // default 0
    pub event_count: i32, // default 0

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
