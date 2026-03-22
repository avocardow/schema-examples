// metric_rollups: Pre-computed metric aggregations at various time granularities.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum MetricGranularity {
    Hourly,  // type: String
    Daily,
    Weekly,
    Monthly,
}

// Composite unique constraint (not expressible inline):
// - unique(metric_id, granularity, period_start, dimensions)

#[spacetimedb::table(name = metric_rollups, public)]
pub struct MetricRollup {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub metric_id: String, // UUID, FK → metric_definitions.id (cascade delete)

    // Composite index: (metric_id, granularity, period_start) — enforce in reducer logic
    pub granularity: MetricGranularity,
    #[index(btree)]
    pub period_start: Timestamp,
    pub period_end: Timestamp,
    pub value: f64,
    pub count: i64,
    pub dimensions: Option<String>, // JSON
    pub computed_at: Timestamp,
    pub created_at: Timestamp,
}
