// experiment_results: Statistical results per variant per metric with significance testing.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique constraint (not expressible inline):
// - unique(experiment_id, variant_id, metric_id)

#[spacetimedb::table(name = experiment_results, public)]
pub struct ExperimentResult {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub experiment_id: String, // UUID, FK → experiments.id (cascade delete)

    pub variant_id: String, // UUID, FK → experiment_variants.id (cascade delete)
    pub metric_id: String, // UUID, FK → metric_definitions.id (cascade delete)
    pub sample_size: i64,
    pub mean_value: Option<f64>,
    pub stddev: Option<f64>,
    pub ci_lower: Option<f64>,
    pub ci_upper: Option<f64>,
    pub p_value: Option<f64>,
    pub lift: Option<f64>,
    pub is_significant: bool,
    pub computed_at: Timestamp,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
