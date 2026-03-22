// experiments: A/B test experiments with traffic allocation and lifecycle tracking.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum ExperimentStatus {
    Draft,     // type: String
    Running,
    Paused,
    Completed,
}

#[spacetimedb::table(name = experiments, public)]
pub struct Experiment {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,
    pub hypothesis: Option<String>,
    #[index(btree)]
    pub status: ExperimentStatus,
    pub traffic_percentage: f64,
    pub started_at: Option<Timestamp>,
    pub ended_at: Option<Timestamp>,

    #[index(btree)]
    pub created_by: String, // UUID, FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
