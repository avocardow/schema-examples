// metric_definitions: Reusable metric formulas with aggregation type and optional event filtering.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum MetricAggregation {
    Count,       // type: String
    Sum,
    Average,
    Min,
    Max,
    CountUnique,
    Percentile,
}

#[spacetimedb::table(name = metric_definitions, public)]
pub struct MetricDefinition {
    #[primary_key]
    pub id: String, // UUID

    #[unique]
    pub name: String,

    pub display_name: String,
    pub description: Option<String>,
    #[index(btree)]
    pub aggregation: MetricAggregation,

    #[index(btree)]
    pub event_type_id: Option<String>, // UUID, FK → event_types.id (set null)

    pub property_key: Option<String>,
    pub filters: Option<String>, // JSON
    pub unit: Option<String>,
    pub format: Option<String>,

    #[index(btree)]
    pub is_active: bool,

    #[index(btree)]
    pub created_by: String, // UUID, FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
