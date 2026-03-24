// milestones: Time-bound goals or release targets within a project.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum MilestoneStatus {
    Planned, // type: String
    Active,
    Completed,
    Cancelled,
}

#[spacetimedb::table(name = milestones, public)]
pub struct Milestone {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub project_id: String, // UUID — FK → projects.id (cascade delete)
    pub name: String,
    pub description: Option<String>,
    pub status: MilestoneStatus,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub position: i32,
    pub created_at: Timestamp,
    pub updated_at: Timestamp,
    // Composite index: (project_id, status)
    // Composite index: (project_id, position)
}
