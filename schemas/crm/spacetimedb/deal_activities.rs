// deal_activities: Append-only audit trail of deal changes for pipeline analytics.
// See README.md for full design rationale.

use spacetimedb::Timestamp;

#[derive(SpacetimeType, Clone)]
pub enum DealActivityAction {
    Created, // type: String
    Updated,
    StageChanged,
    Won,
    Lost,
    Reopened,
}

#[spacetimedb::table(name = deal_activities, public)]
pub struct DealActivity {
    #[primary_key]
    pub id: String, // UUID
    #[index(btree)]
    pub deal_id: String, // UUID — FK → deals.id (cascade delete)
    #[index(btree)]
    pub user_id: Option<String>, // UUID — FK → users.id (set null)
    pub action: DealActivityAction,
    pub field: Option<String>,
    pub old_value: Option<String>,
    pub new_value: Option<String>,
    pub created_at: Timestamp,
}
