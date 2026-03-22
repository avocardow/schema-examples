// experiment_goals: Links experiments to their target conversion goals.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

// Composite unique constraint (not expressible inline):
// - unique(experiment_id, goal_id)

#[spacetimedb::table(name = experiment_goals, public)]
pub struct ExperimentGoal {
    #[primary_key]
    pub id: String, // UUID

    #[index(btree)]
    pub experiment_id: String, // UUID, FK → experiments.id (cascade delete)

    #[index(btree)]
    pub goal_id: String, // UUID, FK → goals.id (cascade delete)

    pub is_primary: bool,
    pub created_at: Timestamp,
}
