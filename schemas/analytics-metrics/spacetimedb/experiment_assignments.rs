// experiment_assignments: Records which users or anonymous visitors are assigned to which variant.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique constraint (not expressible inline):
// - unique(experiment_id, user_id)

#[spacetimedb::table(name = experiment_assignments, public)]
pub struct ExperimentAssignment {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub experiment_id: String, // UUID, FK → experiments.id (cascade delete)

    // Composite index: (experiment_id, variant_id) — enforce in reducer logic
    pub variant_id: String, // UUID, FK → experiment_variants.id (cascade delete)

    #[index(btree)]
    pub user_id: Option<String>, // UUID, FK → users.id (set null)

    pub anonymous_id: Option<String>,
    #[index(btree)]
    pub assigned_at: Timestamp,
    pub created_at: Timestamp,
}
