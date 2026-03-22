// experiment_variants: Variant arms within an experiment with weight allocation.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique constraint (not expressible inline):
// - unique(experiment_id, name)

#[spacetimedb::table(name = experiment_variants, public)]
pub struct ExperimentVariant {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub experiment_id: String, // UUID, FK → experiments.id (cascade delete)

    pub name: String,
    pub description: Option<String>,
    pub is_control: bool,
    pub weight: f64,
    pub config: Option<String>, // JSON
    pub created_at: Timestamp,
}
