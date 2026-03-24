// task_dependencies: Dependency relationships between tasks.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum TaskDependencyType {
    Blocks, // type: String
    IsBlockedBy,
    RelatesTo,
    Duplicates,
}

#[spacetimedb::table(name = task_dependencies, public)]
pub struct TaskDependency {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub task_id: String, // UUID — FK → tasks.id (cascade delete)
    #[index(btree)]
    pub depends_on_id: String, // UUID — FK → tasks.id (cascade delete)
    pub dependency_type: TaskDependencyType,
    pub created_at: Timestamp,
    // Composite unique: (task_id, depends_on_id, type)
}
