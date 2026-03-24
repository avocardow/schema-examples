// pipeline_stages: Ordered stages within a sales pipeline.
// See README.md for full design rationale.
// Composite index: (pipeline_id, position) — btree on pipeline_id covers leading column

use spacetimedb::Timestamp;

#[spacetimedb::table(name = pipeline_stages, public)]
pub struct PipelineStage {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub pipeline_id: String, // UUID — FK → pipelines.id (cascade delete)
    pub name: String,
    pub position: i32,
    pub win_probability: Option<i32>,
    pub is_closed_won: bool,
    pub is_closed_lost: bool,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
