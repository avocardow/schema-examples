// goals: Conversion goals that track specific user actions or page views.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum GoalType {
    Event,    // type: String
    PageView,
    Custom,
}

#[spacetimedb::table(name = goals, public)]
pub struct Goal {
    #[primary_key]
    pub id: String, // UUID

    pub name: String,
    pub description: Option<String>,
    #[index(btree)]
    pub goal_type: GoalType,

    #[index(btree)]
    pub event_type_id: Option<String>, // UUID, FK → event_types.id (set null)

    pub url_pattern: Option<String>,
    pub value: Option<f64>,

    #[index(btree)]
    pub is_active: bool,

    #[index(btree)]
    pub created_by: String, // UUID, FK → users.id (restrict delete)

    pub created_at: Timestamp,
    pub updated_at: Timestamp,
}
